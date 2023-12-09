import type { Repo } from './repo.types'
import type { TExEventData } from './exam.types'
import type { TSocketMessageObj } from './socket.types'
import type { EPlayerTestType } from './exam.types'
import type {
  EResultStatus,
  EResultAction,
  TRunResultActionMeta,
  TParkinRunStepOptsMap,
} from '@ltipton/parkin'
import type {
  TBrowser,
  TBrowserPage,
  TBrowserContext,
  TConsoleCallback,
  TBrowserActionOptions,
} from './pw.types'

// Exported from browser/src/types
import type { Player } from '@gobletqa/browser'

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
  forwardLogs?:boolean
  onEvent?:TPlayerEventCB
  context?:TBrowserContext
  onConsole?:TConsoleCallback
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
  runId:string
  location:string
  fileType:string
  runTimestamp:number
  fullTestRun?:boolean
  procId?:number|string
})

export type TPlayerTestExpectation = {
  type:string
  message:string
}

// --- TODO: validate these are needed, should use the types from exam instead
// --- Seems like this is being done in two places

export type TPlayerTestShared = {
  timestamp:number
  location?:string
  htmlReport?:string
  metaData?:TRunResultActionMeta
  status:EResultStatus|`running`|`passed`|`failed`
}

export type TPlayerTestStart = Omit<TExEventData, `type`|`action`|`status`>
  & TPlayerTestShared
  & {
      type:EPlayerTestType.test
      action:EResultAction.start
    }

export type TPlayerTestDone = Omit<TExEventData, `type`|`action`|`status`>
  & TPlayerTestShared
  & {
      type:EPlayerTestType.test
      action:EResultAction.end
    }

export type TPlayerTestResult = Omit<TExEventData, `type`|`action`|`status`>
  & TPlayerTestShared
  & {
      type:EPlayerTestType.test
      action:EResultAction.test
    }

export type TPlayerTestEvent = Omit<TExEventData, `type`|`action`|`status`>
  & TPlayerTestShared
  & {
      type:EPlayerTestType
      action:EResultAction|`error`
      failedExpectations?:any[]
    }

export type TPlayerEventData = TPlayerTestEvent
  | TPlayerTestStart
  | TPlayerTestDone
  | TPlayerTestResult
  | TPlayerTestSuiteDone
  | TPlayerTestSuiteFinished
  | TExEventData


export type TPlayerTestSuiteDone<T=TPlayerTestEvent> = (TPlayerTestEvent & {
  tests: T[]
})

export type TPlayerTestSuiteFinished<T=TPlayerTestEvent> = (TPlayerTestEvent & {
  describes: T[]
})

export type TPlayerFinished = TPlayerResEvent<Record<string, any>>
export type TPlayerStarted = TPlayerResEvent<Record<string, any>>
export type TPlayerResult = TPlayerResEvent<TPlayerSuiteResult[]>

export type TPlayerSpecDone = TPlayerResEvent<TPlayerTestDone>
export type TPlayerSpecStart = TPlayerResEvent<TPlayerTestStart>

export type TPlayerSuiteStart = TPlayerResEvent<TPlayerTestEvent>
export type TPlayerSuiteDone = TPlayerResEvent<TPlayerTestSuiteDone<TPlayerTestResult>>
export type TPlayerSuiteResult = TPlayerResEvent<
  TPlayerTestSuiteFinished<TPlayerTestSuiteDone<TPlayerTestResult>>
>

export type TPlayerTestEventMeta = TPlayerFinished
  | TPlayerStarted
  | TPlayerResult
  | TPlayerSpecDone
  | TPlayerSpecStart
  | TPlayerSuiteStart
  | TPlayerSuiteDone
  | TPlayerSuiteResult
