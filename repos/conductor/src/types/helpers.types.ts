export type TUserHash = string
export type TUserHashMap = Record<TUserHash, TUserHash>
export type TPort = string | number
export type TPorts = TPort[]
export type TLogLevel = 'info' | 'warn' | 'error' | 'debug' | 'verbose'
export type TRestartPolicy = `always` | `on-failure` | `never`
