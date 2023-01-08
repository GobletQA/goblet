import type { TRepo } from './repo.types'
import type { TFileModel } from './models.types'
import type { Player } from '@gobletqa/screencast'
import type { TSocketMessageObj } from './socket.types'
import type { TBrowserContext, TBrowserPage, TBrowser } from './pw.types'

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
  options?:TPlayerOpts
  onEvent?:TPlayerEventCB
  context?:TBrowserContext
  onCleanup?:TPlayerCleanupCB
}

export type TPlayerStartConfig = TPlayerConfig & {
  url:string
}


export type TPlayerOpts = {
  file?: TFileModel
}

export type TPlayerResEvent<T=Record<string, any>> = Omit<TSocketMessageObj, `data`> & {
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

export type TPlayerTestMeta = {
  id:string
  testPath:string
  fullName:string
  failed:boolean
  passed:boolean
  timestamp:number
  description:string
  // These exist, but are not being used by parkin
  // So ignoring them for now
  // failedExpectations:[]
  // passedExpectations:[]
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

export type TPlayerEnded = TPlayerResEvent<{}>
export type TPlayerStarted = TPlayerResEvent<{}>
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