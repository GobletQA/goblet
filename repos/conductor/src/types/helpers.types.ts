import type { TPort } from './ports.types'

export type TUserHash = string
export type TUserHashMap = Record<TUserHash, TUserHash>
export type TLogLevel = 'info' | 'warn' | 'error' | 'debug' | 'verbose'
export type TRestartPolicy = `always` | `on-failure` | `never`
export type TContainerState = `Creating` | `Running` | `Stopped` | `Missing` | `Pending` | `Error`

export enum EContainerState {
  ERROR = `Error`,
  Error = `Error`,
  MISSING = `Missing`,
  Missing = `Missing`,
  RUNNING = `Running`,
  Running = `Running`,
  STOPPED = `Stopped`,
  Stopped = `Stopped`,
  CREATING = `Creating`,
  Creating = `Creating`,
}


export type TContainerMap = {
  id: string
  name: string
  image: string
  host: string
  state: EContainerState
  ports: Record<string, TPort>
  labels: Record<string, string>
}