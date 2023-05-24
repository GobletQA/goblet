import type { TRepo } from './repo.types'
import type { TSocketMessageObj } from './socket.types'
import type { TBrowserActionOptions, TBrowserContext, TBrowserPage, TBrowser } from './pw.types'

// Exported from screencast/src/types
import type { Player } from '@gobletqa/screencast'
import {EAstObject} from '@ltipton/parkin'

export type TPlayerEvent = {
  name:string
  message?:string
  isPlaying:boolean
  data?:TPlayerTestEvent
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
  options?:TBrowserActionOptions
}

export type TPlayerStartConfig = TPlayerConfig & {
  url:string
}

export type TPlayerOpts = TBrowserActionOptions

export type TPlayerResEvent<T=TPlayerTestEvent> = Omit<TSocketMessageObj, `data`> & {
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

export type TPlayerTestMeta = {
  id:string
  testPath:string
  fullName:string
  failed:boolean
  passed:boolean
  message?:string
  timestamp:number
  describes?:any[]
  description:string
  eventParent?:EAstObject
  tests?: TPlayerTestMeta[]
  options?:Record<string, string|number>
  failedExpectations?:TPlayerTestExpectation[]
  passedExpectations?:TPlayerTestExpectation[]
}

export type TPlayerTestEvent = TPlayerTestMeta & {
  type:EPlayerTestType
  action:EPlayerTestAction
  status?:EPlayerTestStatus
}

export type TPlayerTestStart = TPlayerTestMeta & {
  status:EPlayerTestStatus
  type:EPlayerTestType.test
  action:EPlayerTestAction.start
}

export type TPlayerTestDone = TPlayerTestMeta & {
  status:EPlayerTestStatus
  type:EPlayerTestType.test
  action:EPlayerTestAction.end
}

export type TPlayerTestResult = TPlayerTestMeta & {
  status:EPlayerTestStatus
  type:EPlayerTestType.test
  action:EPlayerTestAction.test
}

export type TPlayerTestSuiteDone<T=TPlayerTestEvent> = TPlayerTestEvent & {
  tests: T[]
}

export type TPlayerTestSuiteFinished<T=TPlayerTestEvent> = TPlayerTestEvent & {
  describes: T[]
}

export type TPlayerEventData = TPlayerTestEvent
  | TPlayerTestStart
  | TPlayerTestDone
  | TPlayerTestResult
  | TPlayerTestSuiteDone
  | TPlayerTestSuiteFinished


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