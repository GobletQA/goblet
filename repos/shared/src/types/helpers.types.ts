import type { TPort } from './ports.types'

export type TUserHash = string
export type TAnyCB = (...args:any[]) => any
export type TUserHashMap = Record<TUserHash, TUserHash>
export type TLogLevel = `info` | `warn` | `error` | `debug` | `verbose`
export type TRestartPolicy = `always` | `on-failure` | `never`

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

export type TJwtConfig = {
  exp: string
  secret: string
  refreshExp: string
  refreshSecret: string
  algorithms: string[],
  credentialsRequired: boolean
}

export type TError = Error & {
  statusCode:number
}

export type TException = TError
