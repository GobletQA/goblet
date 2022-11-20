import type { Repo } from '@GSH/repo/repo'
import type { TGFileTypes } from './files.types'
import type { TRecorderOpts, TGScreencastConfig } from './screencast.types'

export type TGobletConfig = Repo | {
  recorder: TRecorderOpts
  fileTypes: TGFileTypes
  paths: Record<string, string>
  screencast: TGScreencastConfig
  internalPaths: Record<string, string>
}
