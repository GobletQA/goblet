import type { Repo } from '@GSH/repo/repo'
import type { TRepoPaths } from './repo.types'
import type { TGFileTypes } from './files.types'
import type { TRecorderOpts, TGScreencastConfig } from './screencast.types'

export type TInternalPaths = {
  gobletRoot: string
  pwMetaDataDir: string
  testUtilsDir: string
  screencastDir: string
  defaultStepsDir: string
  tracesTempDir: string
  videosTempDir: string
  downloadsTempDir: string
  testMetaFile: string
  snapshotsTempDir: string
  reportsTempDir: string
  reportsTempFile: string
}

export type TDefGobletConfig = {
  paths: TRepoPaths
  fileTypes: TGFileTypes
  recorder: TRecorderOpts
  internalPaths: TInternalPaths
  screencast: TGScreencastConfig
}

export type TGobletConfig = Repo | TDefGobletConfig
