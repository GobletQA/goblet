import type { Repo } from './workflows.types'
import type { TRepoPaths } from './repo.types'
import type { TExamConfig } from './exam.types'
import type { TLogLevel } from './helpers.types'
import type { TGFileTypes } from './files.types'
import type { TWorldConfig } from '@ltipton/parkin'
import type { TBrowserConf, TBrowserContextOpts } from './pw.types'

import type { TRecorderOpts, TGScreencastConfig } from './screencast.types'

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
  testMetaFile: string
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

export type TDefGobletConfig = {
  $ref?:string
  $merge?: string[],
  paths: TRepoPaths
  world?:TWorldConfig
  fileTypes: TGFileTypes
  recorder: TRecorderOpts
  playwright?:TGobletPWConfig
  screencast: TGScreencastConfig
  testConfig?:Partial<TExamConfig>
}

export type TGobletConfig = Repo | TDefGobletConfig
