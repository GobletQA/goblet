import type { TPort } from './ports.types'

export type TUserHash = string
export type TUserHashMap = Record<TUserHash, TUserHash>
export type TLogLevel = 'info' | 'warn' | 'error' | 'debug' | 'verbose'
export type TRestartPolicy = `always` | `on-failure` | `never`
export type TContainerState = `Creating` | `Running` | `Stopped` | `Missing` | `Pending`

export type TContainerMap = {
  id: string
  name: string
  image: string
  host: string
  state: TContainerState
  ports: Record<string, TPort>
  labels: Record<string, string>
}