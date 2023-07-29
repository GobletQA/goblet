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
import { nanoid } from '@GEX/utils/nanoid'
import { exists, limbo } from '@keg-hub/jsutils'
import { PoolCfg } from '@GEX/constants/defaults'
import { WorkerEvents } from '@GEX/constants/worker'
import { Worker, MessageChannel } from 'worker_threads'
import { AggregateError } from '@GEX/workerPool/aggregateErrors'

export class WorkerPool extends EventEmitter {
  #location:string
  #pool:Worker[]=[]
  #queue:TWorkerQueue[]=[]
  #wrkOpts:WorkerOptions
  #size:number=4
  #closing=false
    
  constructor (cfg:TPoolCfg) {
    super()

    this.#location = cfg.location
    this.#size = cfg.size || PoolCfg.size
    this.#wrkOpts = {...PoolCfg.worker, ...cfg.worker}

    for (let i = 0; i < this.#size; i++)
      this.#addNewWorkerToPool()

    this.on(WorkerEvents.Release, this.#onRelease.bind(this))
  }

  run (workerData:TWorkerData) {
    return new Promise((res, rej) => {
      if(this.#pool.length <= 0)
        return this.#queue.push((worker:Worker) => this.#run(worker, workerData, res, rej))

      const worker = this.#pool.shift()
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

  #closeErrors = (maybeErrs:TMaybeErr[]) => {
    const errs = maybeErrs.filter(exists)
    if (errs.length > 0) throw new AggregateError(errs)
  }

  queueLength () {
    return this.#queue.length
  }

  poolLength () {
    return this.#pool.length
  }

  #onRelease = (worker:Worker) => {
    if (this.#queue.length <= 0)
      return this.#pool.push(worker)
    
    const cb = this.#queue.shift()
    cb(worker)
  }

  #run = (
    worker:Worker,
    workerData:TWorkerData,
    res:TPromRes,
    rej:TPromRej
  ) => {

    this.emit(WorkerEvents.Run)
    const messageChannel = new MessageChannel()

    messageChannel.port2.once(WorkerEvents.Message, (result) => {
      worker.removeAllListeners(WorkerEvents.Error)
      this.#onMessage(res, worker, result)
    })

    worker.once('error', (err) => {
      console.log(`------- on error -------`)
      
      rej(err)
      this.#addNewWorkerToPool()
    })

    worker.postMessage({
      workerId: worker.threadId,
      ...workerData,
      port: messageChannel.port1,
    }, [messageChannel.port1])
  }

  #onMessage = (res:TPromRes, worker:Worker, result:TWorkerResult) => {
    this.emit(WorkerEvents.Release, worker)
    res(result)
  }

  #addNewWorkerToPool = () => {
    const worker = new Worker(this.#location, {
      ...this.#wrkOpts,
      env: {
        NODE_ENV: process.env.NODE_ENV,
        EXAM_CLI_ENV: process.env.EXAM_CLI_ENV,
        ...this.#wrkOpts.env as NodeJS.Dict<string>,
      },
      workerData: {
        workerId: nanoid(),
        ...this.#wrkOpts.workerData,
      }
    })

    worker.once(WorkerEvents.Exit, (exitCode) => {
      exitCode !== 0
        && !this.#closing
        && this.#addNewWorkerToPool()
    })

    this.#pool.push(worker)
  }
}
