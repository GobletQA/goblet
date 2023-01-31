import { TGitMeta } from './git.types'
import { TCreateRepo } from './repo.types'
import { TRepoOpts, TRepoMountStatus } from './shared.types'

export type TWFArgs = TGitMeta & {
  token: string|boolean
  repoTemplate?: string
}

export type TWFCreateArgs = TGitMeta & {
  token: string|boolean
  create: TCreateRepo
}

export type TResArgs = Omit<TRepoMountStatus, `message`> & {
  repo?: TRepoOpts
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