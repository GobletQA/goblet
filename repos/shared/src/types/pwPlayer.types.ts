import type { TRepo } from './workflows.types'
import { EAstObject, TRunResult } from '@ltipton/parkin'
import type { TSocketMessageObj } from './socket.types'
import type { TParkinRunStepOptsMap } from '@ltipton/parkin'
import type { TBrowserActionOptions, TBrowserContext, TBrowserPage, TBrowser } from './pw.types'

// Exported from screencast/src/types
import type { Player } from '@gobletqa/screencast'

export type TPlayerEvent = {
  name:string
  message?:string
  isPlaying:boolean
  data?:TPlayerEventData
}

export type TPlayerEventCB = (event:TPlayerEvent) => void

export type TPlayerCleanupCB = (player:Player) => void

export type TPlayerConfig = {
  repo?:TRepo
  browser?:TBrowser
  page?:TBrowserPage
  onEvent?:TPlayerEventCB
  context?:TBrowserContext
  onCleanup?:TPlayerCleanupCB
  steps?:TParkinRunStepOptsMap
  options?:TBrowserActionOptions
}

export type TPlayerStartConfig = TPlayerConfig & {
  url:string
}

export type TPlayerOpts = TBrowserActionOptions

export type TPlayerResEvent<T=TPlayerEventData> = Omit<TSocketMessageObj, `data`> & {
  location: string,
  fileType: string,
  data:T
}

export enum EPlayerTestAction {
  end=`end`,
  test=`test`,
  start=`start`,
}

export enum EPlayerTestType {
  test=`test`,
  describe=`describe`,
}

export enum EPlayerTestStatus {
  failed=`failed`,
  passed=`passed`,
}

export type TPlayerTestExpectation = {
  type:string
  message:string
}

export type TEventParent = EAstObject.step
  | EAstObject.scenario
  | EAstObject.background
  | EAstObject.rule
  | EAstObject.feature

export type TPlayerTestStart = Omit<TRunResult, `type`|`action`|`status`> & {
  status:EPlayerTestStatus
  type:EPlayerTestType.test
  eventParent?: TEventParent
  action:EPlayerTestAction.start
}

export type TPlayerTestDone = Omit<TRunResult, `type`|`action`|`status`> & {
  status:EPlayerTestStatus
  type:EPlayerTestType.test
  eventParent?: TEventParent
  action:EPlayerTestAction.end
}

export type TPlayerTestResult = Omit<TRunResult, `type`|`action`|`status`> & {
  status:EPlayerTestStatus
  type:EPlayerTestType.test
  eventParent?: TEventParent
  action:EPlayerTestAction.test
}

export type TPlayerTestEvent = Omit<TRunResult, `type`|`action`|`status`> & {
  type:EPlayerTestType
  action:EPlayerTestAction
  status?:EPlayerTestStatus
  eventParent?: TEventParent
}

export type TPlayerEventData = TPlayerTestEvent
  | TPlayerTestStart
  | TPlayerTestDone
  | TPlayerTestResult
  | TPlayerTestSuiteDone
  | TPlayerTestSuiteFinished
  | TRunResult


export type TPlayerTestSuiteDone<T=TPlayerTestEvent> = TPlayerTestEvent & {
  tests: T[]
}

export type TPlayerTestSuiteFinished<T=TPlayerTestEvent> = TPlayerTestEvent & {
  describes: T[]
}

export type TPlayerEnded = TPlayerResEvent<Record<string, any>>
export type TPlayerStarted = TPlayerResEvent<Record<string, any>>
export type TPlayerResult = TPlayerResEvent<TPlayerSuiteResult[]>

export type TPlayerSpecDone = TPlayerResEvent<TPlayerTestDone>
export type TPlayerSpecStart = TPlayerResEvent<TPlayerTestStart>

export type TPlayerSuiteStart = TPlayerResEvent<TPlayerTestEvent>
export type TPlayerSuiteDone = TPlayerResEvent<TPlayerTestSuiteDone<TPlayerTestResult>>
export type TPlayerSuiteResult = TPlayerResEvent<
  TPlayerTestSuiteFinished<TPlayerTestSuiteDone<TPlayerTestResult>>
>

export type TPlayerTestEventMeta = TPlayerEnded
  | TPlayerStarted
  | TPlayerResult
  | TPlayerSpecDone
  | TPlayerSpecStart
  | TPlayerSuiteStart
  | TPlayerSuiteDone
  | TPlayerSuiteResult
