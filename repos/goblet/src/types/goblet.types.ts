import type {
  TRepoPaths,
  TExamConfig,
  TGFileTypes,
  TGBWorldCfg,
  TGobletPWConfig,
} from './shared.types'

export type TRecorderOpts = {
  locator: string
  [key:string]: any
}

export type TDefGobletConfig = {
  $ref?:string
  $merge?: string[],
  paths: TRepoPaths
  world?:TGBWorldCfg
  fileTypes: TGFileTypes
  recorder: TRecorderOpts
  playwright?:TGobletPWConfig
  testConfig?:Partial<TExamConfig>
}