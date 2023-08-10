import type { WorkerOptions } from 'worker_threads'
import type {
  TPromRej,
  TPromRes,
  TPoolCfg,
  TWorkerData,
  TWorkerQueue,
  TWorkerResult,
} from '@GEX/types'

import EventEmitter from 'events'
import { Logger } from '@GEX/utils/logger'
import { nanoid } from '@GEX/utils/nanoid'
import { Errors } from '@GEX/constants/errors'
import { limbo } from '@keg-hub/jsutils/limbo'
import { exists } from '@keg-hub/jsutils/exists'
import { WkrPoolTag } from '@GEX/constants/tags'
import { AggregateError } from '@GEX/utils/error'
import { WorkerEvents } from '@GEX/constants/worker'
import { flatUnion } from '@keg-hub/jsutils/flatUnion'
import { Worker, MessageChannel } from 'worker_threads'
import { PoolCfg, WorkerEnvs } from '@GEX/constants/defaults'
import { emptyArr } from '@keg-hub/jsutils/emptyArr'

type TWorkerCfg = {
  tag:string
  workerId: string|number
}

type TWorker = Worker & {
  __exam: TWorkerCfg
}


export class WorkerPool extends EventEmitter {
  tag=WkrPoolTag
  #closing=false
  #size:number=4
  #location:string
  #pool:TWorker[]=[]
  #wrkOpts:WorkerOptions
  #queue:TWorkerQueue[]=[]
  closeTimeout:number=5000

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
    const timeouts = {}

    for (let index = 0; index < size; index++) {
      const worker = this.#pool.shift()

      promises.push(new Promise(async (res) => {
        worker.postMessage({
          terminate: true,
          event: WorkerEvents.Terminate,
        })

        /**
         * Sets a timeout waiting for the worker to shutdown gracefully
         * If it does not in the allowed time limit (this.closeTimeout),
         * Then we force shutdown the worker and return an error
         */
        timeouts[worker.__exam.workerId] = setTimeout(
          async () => {
            const resp = await worker.terminate()
            timeouts[worker.__exam.workerId] = undefined

            return !resp
              ? res(0)
              : res(Errors.WorkerTerminate(worker.__exam.tag, resp))
          }, this.closeTimeout)

        /**
         * Listen for the stopped event from the worker and clear the timeout
         * The Stopped event is called when 
         * The worker shuts down properly before the close timeout fires
         * And forces the worker to shutdown
         */
        this.on(WorkerEvents.Stopped, ({ workerId }) => {
          if(!timeouts[workerId]) return

          clearTimeout(timeouts[workerId])
          timeouts[workerId] = undefined
          delete timeouts[workerId]

          res(0)
        })

      }))
    }

    const [error, maybeErrs] = await limbo(Promise.all(promises))
    const errs = maybeErrs.filter(Boolean)

    error
      ? this.emit(WorkerEvents.Error, error)
      : errs?.length && this.#closeErrors(errs)

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

  #closeErrors = (errs:Error[]) => {
    if (errs.length) throw new AggregateError(errs)
  }

  #onRelease = (worker:TWorker) => {
    this.#wLog(worker, `Finished Job`)
    this.#pLog(`Found ${this.#queue.length} queued Jobs`)

    if (this.#queue.length <= 0){
      this.#pLog(`Adding ${worker.__exam.tag} back to ${this.tag}`)
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

    messageChannel.port2.on(WorkerEvents.Message, (result) => {
      worker.removeAllListeners(WorkerEvents.Error)
      this.#onMessage(res, worker, result)
    })

    worker.on(WorkerEvents.Error, (err) => {
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
      argv: flatUnion([
        ...process?.argv,
        ...(this.#wrkOpts?.argv || emptyArr),
      ]),
      execArgv: flatUnion([
        ...process?.execArgv,
        ...(this.#wrkOpts?.execArgv || emptyArr),
        '--unhandled-rejections=strict'
      ]),
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
        logLevel: Logger.level,
      }
    }) as TWorker

    worker.__exam = worker.__exam || {
      workerId,
      tag: Logger.colors.cyan(`[${workerId}]`),
    }

    worker.once(WorkerEvents.Exit, (exitCode) => {
      this.#closing
        ? exitCode === 0 && this.emit(WorkerEvents.Stopped, { workerId: worker.__exam.workerId })
        : exitCode !== 0 && this.#addNewWorkerToPool(workerId)
    })

    this.#pool.push(worker)
  }
}
