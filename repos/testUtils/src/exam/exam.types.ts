
import type { TParkinRunStepOptsMap } from '@ltipton/parkin'
import type {
  TBrowser,
  TBrowserPage,
  TBrowserContext,
  TBrowserActionOptions,
} from '@gobletqa/shared'

import type { Repo } from '@gobletqa/repo'

import type {
  TExamEventCB,
  TExamCancelCB,
  TExamCleanupCB,
} from '@gobletqa/exam'

export type TExamOpts = {}
export type TExamConfig = {}

export type TExamStartConfig = {}

export type TRepoExamConfig = {
  repo?:Repo
  browser?:TBrowser
  page?:TBrowserPage
  onEvent?:TExamEventCB
  context?:TBrowserContext
  onCancel?:TExamCancelCB
  onCleanup?:TExamCleanupCB
  steps?:TParkinRunStepOptsMap
  options?:TBrowserActionOptions
}

export type TRepoExamStartConfig = TRepoExamConfig & {
  url:string
}
