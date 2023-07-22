import type { Repo } from './workflows.types'
import type { TRepoPaths } from './repo.types'
import type { TLogLevel } from './helpers.types'
import type { TGFileTypes } from './files.types'

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

export type TDefGobletConfig = {
  $merge?: string[],
  paths: TRepoPaths
  fileTypes: TGFileTypes
  recorder: TRecorderOpts
  internalPaths: TInternalPaths
  screencast: TGScreencastConfig
}

export type TGobletConfig = Repo | TDefGobletConfig
