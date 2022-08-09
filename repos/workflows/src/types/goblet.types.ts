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
  [key:string]: any
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

export type TGobletConfig = {
  recorder: TRecorderOpts
  paths: Record<string, string>
  screencast: TGScreencastConfig
  internalPaths: Record<string, string>
  __VALID_GOBLET_CONFIG?: boolean
}