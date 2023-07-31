
import type { TFeatureAst, TParkinRunStepOptsMap } from '@ltipton/parkin'
import type {
  TRepo,
  TBrowser,
  TBrowserPage,
  TBrowserContext,
  TBrowserActionOptions,
} from '@gobletqa/shared'

import type {
  TExamEventCB,
  TExamCancelCB,
  TExamCleanupCB,
} from '@gobletqa/exam'

export type TExamOpts = {}
export type TExamConfig = {}

export type TExamStartConfig = {}

export type TRepoExamConfig = {
  repo?:TRepo
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
