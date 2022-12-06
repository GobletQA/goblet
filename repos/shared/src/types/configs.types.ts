import type { Repo } from '@GSH/repo/repo'
import type { TGFileTypes } from './files.types'
import type { TRecorderOpts, TGScreencastConfig } from './screencast.types'

export type TDefGobletConfig = {
  recorder: TRecorderOpts
  fileTypes: TGFileTypes
  paths: Record<string, string>
  screencast: TGScreencastConfig
   internalPaths: Record<string, string>
}

export type TGobletConfig = Repo | TDefGobletConfig
