import type { Worker, WorkerOptions } from 'worker_threads'

export type TMaybeErr = Error|Record<`message`, string>|string

export type TWorkerData = any
export type TWorkerResult = any

export type TPromRes = (value: unknown) => void
export type TPromRej = (reason?: any) => void

export type TWorkerQueue = (worker:Worker) => void

export type TPoolCfg = {
  size?:number
  worker?: WorkerOptions
  location:string
}

export type TCleanStack = {
  pretty?:boolean
  basePath?:string
  pathFilter?:(match:string) => string
}

export type TIndentStrOpts = {
  indent?:string
  includeEmptyLines?:boolean
}