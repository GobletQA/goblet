import type { WorkerOptions } from 'worker_threads'
import type {
  TPromRej,
  TPromRes,
  TPoolCfg,
  TMaybeErr,
  TWorkerData,
  TWorkerQueue,
  TWorkerResult,
} from '@GEX/types'

import EventEmitter from 'events'
import { Logger } from '@GEX/utils/logger'
import { nanoid } from '@GEX/utils/nanoid'
import { exists, limbo } from '@keg-hub/jsutils'
import { PoolCfg, WorkerEnvs } from '@GEX/constants/defaults'
import { WorkerEvents } from '@GEX/constants/worker'
import { Worker, MessageChannel } from 'worker_threads'
import { AggregateError } from '@GEX/workerPool/aggregateErrors'

type TWorkerCfg = {
  tag:string
  workerId: string|number
}

type TWorker = Worker & {
  __exam: TWorkerCfg
}


export class WorkerPool extends EventEmitter {
  #closing=false
  #size:number=4
  #location:string
  #pool:TWorker[]=[]
  #wrkOpts:WorkerOptions
  #queue:TWorkerQueue[]=[]
  tag=Logger.colors.yellow(`[WKR-POOL]`)

  constructor (cfg:TPoolCfg) {
    super()

    this.#pLog(`Initializing worker-pool...`)
    this.#location = cfg.location
    this.#size = cfg.size || PoolCfg.size
    this.#wrkOpts = {...PoolCfg.worker, ...cfg.worker}

    this.#pLog(`Creating ${this.#size} worker and adding to pool...`)
    for (let i = 0; i < this.#size; i++){
      this.#addNewWorkerToPool()
    }

    this.on(WorkerEvents.Release, this.#onRelease.bind(this))
  }

  run (workerData:TWorkerData) {
    return new Promise((res, rej) => {
      
      if(this.#pool.length <= 0){
        this.#pLog(`Received job; adding to job queue...`)
        return this.#queue.push((worker:TWorker) => this.#run(worker, workerData, res, rej))
      }

      const worker = this.#pool.shift()
      this.#pLog(`Received job; Running with worker ${worker.__exam.tag}`)
      this.#run(worker, workerData, res, rej)
    })
  }

  close = async () => {
    const promises = []
    this.#closing = true
    const size = this.poolLength()

    for (let index = 0; index < size; index++) {
      const worker = this.#pool.shift()
      promises.push(new Promise(async (res) => res(await worker.terminate())))
    }

    const [error, maybeErrs] = await limbo(Promise.all(promises))

    error
      ? this.emit(WorkerEvents.Error, error)
      : this.#closeErrors(maybeErrs)

    this.emit(WorkerEvents.Close)
  }

  queueLength () {
    return this.#queue.length
  }

  poolLength () {
    return this.#pool.length
  }

  #wLog = (worker:TWorker, msg:string) => {
    Logger.debug(`${worker.__exam.tag} ${msg}`)
  }
  
  #pLog = (msg:string) => {
    Logger.debug(`${this.tag} ${msg}`)
  }

  #closeErrors = (maybeErrs:TMaybeErr[]) => {
    const errs = maybeErrs.filter(exists)
    if (errs.length > 0) throw new AggregateError(errs)
  }

  #onRelease = (worker:TWorker) => {
    this.#wLog(worker, `Finished Job`)
    this.#pLog(`Found ${this.#queue.length} queued Jobs`)

    if (this.#queue.length <= 0){
      this.#pLog(`Adding ${worker.__exam.workerId} back to Worker-Pool`)
      return this.#pool.push(worker)
    }

    this.#pLog(`Pulling Job from queue for worker ${worker.__exam.tag}`)
    const cb = this.#queue.shift()
    cb(worker)
  }

  #run = (
    worker:TWorker,
    workerData:TWorkerData,
    res:TPromRes,
    rej:TPromRej
  ) => {

    this.#wLog(worker, `Running new job...`)

    this.emit(WorkerEvents.Run)
    const messageChannel = new MessageChannel()

    messageChannel.port2.once(WorkerEvents.Message, (result) => {
      worker.removeAllListeners(WorkerEvents.Error)
      this.#onMessage(res, worker, result)
    })

    worker.once('error', (err) => {
      rej(err)
      this.#addNewWorkerToPool()
    })

    worker.postMessage({
      workerId: worker.threadId,
      ...workerData,
      port: messageChannel.port1,
    }, [messageChannel.port1])
  }

  #onMessage = (res:TPromRes, worker:TWorker, result:TWorkerResult) => {
    this.emit(WorkerEvents.Release, worker)
    res(result)
  }

  #addNewWorkerToPool = (workerId?:string) => {
    workerId = workerId || `WKR-${nanoid()}`

    const worker = new Worker(this.#location, {
      ...this.#wrkOpts,
      env: {
        ...WorkerEnvs.reduce((acc, key) => {
          exists(process.env[key])
          acc[key] = process.env[key]
          return acc
        }, {} as Record<string, string>),
        ...this.#wrkOpts.env as NodeJS.Dict<string>,
      },
      workerData: {
        workerId,
        ...this.#wrkOpts.workerData,
      }
    }) as TWorker

    worker.__exam = worker.__exam || {
      workerId,
      tag: Logger.colors.cyan(`[${workerId}]`),
    }

    worker.once(WorkerEvents.Exit, (exitCode) => {
      exitCode !== 0
        && !this.#closing
        && this.#addNewWorkerToPool(workerId)
    })

    this.#pool.push(worker)
  }
}
