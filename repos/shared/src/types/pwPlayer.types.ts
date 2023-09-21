import type { Repo } from './repo.types'
import type { TExEventData } from './exam.types'
import type { TSocketMessageObj } from './socket.types'
import type { TParkinRunStepOptsMap } from '@ltipton/parkin'
import type { TBrowserActionOptions, TBrowserContext, TBrowserPage, TBrowser } from './pw.types'

import type {
  TEventParent,
  EPlayerTestType,
  EPlayerTestAction,
  EPlayerTestStatus,
} from './exam.types'

// Exported from browser/src/types
import type { Player } from '@gobletqa/browser'

// ---- Already exported from exam
// export enum EPlayerTestAction {
//   end=`end`,
//   test=`test`,
//   start=`start`,
//   error=`error`,
// }

// export enum EPlayerTestStatus {
//   failed=`failed`,
//   passed=`passed`,
// }


// export enum EPlayerTestType {
//   test=`test`,
//   describe=`describe`,
//   feature=`feature`
// }

// export type TEventParent = EAstObject.step
//   | EAstObject.scenario
//   | EAstObject.background
//   | EAstObject.rule
//   | EAstObject.feature


// ---- Already exported from exam


export type TPlayerEvent = {
  name:string
  message?:string
  isPlaying:boolean
  fullTestRun?:boolean
  procId?:number|string
  data?:TPlayerEventData
}

export type TPlayerEventCB = (event:TPlayerEvent) => void

export type TPlayerCleanupCB = (player:Player) => void

export type TPlayerConfig = {
  repo?:Repo
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

export type TPlayerResEvent<T=TPlayerEventData> = (Omit<TSocketMessageObj, `data`> & {
  data:T
  location: string
  fileType: string
  fullTestRun?:boolean
  procId?:number|string
})

export type TPlayerTestExpectation = {
  type:string
  message:string
}

// --- TODO: validate these are needed, should use the types from exam instead
// --- Seems like this is being done in two places

export type TPlayerTestStart = Omit<TExEventData, `type`|`action`|`status`> & {
  id:string
  status:EPlayerTestStatus
  type:EPlayerTestType.test
  eventParent?:TEventParent
  action:EPlayerTestAction.start
}

export type TPlayerTestDone = Omit<TExEventData, `type`|`action`|`status`> & {
  id:string
  status:EPlayerTestStatus
  type:EPlayerTestType.test
  eventParent?:TEventParent
  action:EPlayerTestAction.end
}

export type TPlayerTestResult = Omit<TExEventData, `type`|`action`|`status`> & {
  id:string
  status:EPlayerTestStatus
  type:EPlayerTestType.test
  eventParent?:TEventParent
  action:EPlayerTestAction.test
}

export type TPlayerTestEvent = Omit<TExEventData, `type`|`action`|`status`> & {
  id:string
  message?:string
  type:EPlayerTestType
  action:EPlayerTestAction
  status?:EPlayerTestStatus
  eventParent?:TEventParent
  failedExpectations?:any[]
}

export type TPlayerEventData = TPlayerTestEvent
  | TPlayerTestStart
  | TPlayerTestDone
  | TPlayerTestResult
  | TPlayerTestSuiteDone
  | TPlayerTestSuiteFinished
  | TExEventData


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
