import { TGitMeta, TRepoConf } from './git.types'

export type TWFArgs = TGitMeta & {
  repoTemplate?: string
  token?: string|boolean
}

export type TResArgs = {
  mode?: string
  setup: boolean
  status?: string
  repo?: TRepoConf
  mounted?: boolean
}

export type TWFResp = TResArgs & {
  message: string
}


type TRecorderOpts = {
  locator: string
}

type TGScreencastConfig = {
  active: boolean
}

type TGFileType = {
  ext: string
  type:string
  location:string
}

type TGFileTypes = {
  [key:string]: TGFileType
}

export type TWFGobletConfig = {
  recorder: TRecorderOpts
  fileTypes: TGFileTypes
  paths: Record<string, string>
  screencast: TGScreencastConfig
  internalPaths: Record<string, string>
}