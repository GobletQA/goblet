import type { Worker, WorkerOptions } from 'worker_threads'


export type TWorkerData = any
export type TWorkerResult = any

export type TPromRes = (value: unknown) => void
export type TPromRej = (reason?: any) => void

export type TWorkerQueue = (worker:Worker) => void

export type TPoolCfg = {
  size?:number
  location:string
  worker?: WorkerOptions
}
