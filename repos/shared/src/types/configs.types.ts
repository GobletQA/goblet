import type { TGFileTypes } from './files.types'
import type { TRecorderOpts, TGScreencastConfig } from './screencast.types'


export type TGobletConfig = { 
  recorder: TRecorderOpts
  fileTypes: TGFileTypes
  paths: Record<string, string>
  screencast: TGScreencastConfig
  internalPaths: Record<string, string>
}