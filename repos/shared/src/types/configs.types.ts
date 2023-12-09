import type { TLogLevel } from './helpers.types'
import type { TBrowserConf, TBrowserContextOpts } from './pw.types'

export type TInternalPaths = {
  gobletRoot: string
  pwMetaDataDir: string
  testUtilsDir: string
  screencastDir: string
  defaultStepsDir: string
  tracesTempDir: string
  userDataTempDir: string
  videosTempDir: string
  downloadsTempDir: string
  snapshotsTempDir: string
  reportsTempDir: string
  reportsTempFile: string
}

export type TJWTConfig = {
  exp: string
  secret: string
  refreshExp: string
  refreshSecret: string
  algorithms: string[],
  credentialsRequired: boolean
}

export type TServerConfig = {
  port: number,
  key?: string,
  host?: string,
  jwt: TJWTConfig
  rateLimit: number
  securePort: number
  logLevel: TLogLevel
}

export type TGobletPWConfig = {
  browser?: TBrowserConf
  context?: TBrowserContextOpts
}

