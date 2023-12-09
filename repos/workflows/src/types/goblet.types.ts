import type { TGitMeta } from '@gobletqa/git'
import type { TRepoOpts } from '@gobletqa/repo'
import type { TRecorderOpts } from '@gobletqa/goblet'

import type { TRepoMountStatus, TCreateRepo } from './repo.types'

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
}