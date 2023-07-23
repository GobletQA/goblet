
import type { TExamEvt } from './exam.types'
import type { EAstObject, TRunResult } from '@ltipton/parkin'


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

export type TExTestExpectation = {
  type:string
  message:string
}

export type TEventParent = EAstObject.step
  | EAstObject.scenario
  | EAstObject.background
  | EAstObject.rule
  | EAstObject.feature

export type TExTestStart = Omit<TRunResult, `type`|`action`|`status`> & {
  status:EPlayerTestStatus
  type:EPlayerTestType.test
  eventParent?: TEventParent
  action:EPlayerTestAction.start
}

export type TExTestDone = Omit<TRunResult, `type`|`action`|`status`> & {
  status:EPlayerTestStatus
  type:EPlayerTestType.test
  eventParent?: TEventParent
  action:EPlayerTestAction.end
}

export type TExTestResult = Omit<TRunResult, `type`|`action`|`status`> & {
  status:EPlayerTestStatus
  type:EPlayerTestType.test
  eventParent?: TEventParent
  action:EPlayerTestAction.test
}

export type TExTestEvent = Omit<TRunResult, `type`|`action`|`status`> & {
  type:EPlayerTestType
  action:EPlayerTestAction
  status?:EPlayerTestStatus
  eventParent?: TEventParent
}

export type TExEventData = TExTestEvent
  | TExTestStart
  | TExTestDone
  | TExTestResult
  | TExTestSuiteDone
  | TExTestSuiteFinished
  | TRunResult
  | undefined


export type TExTestSuiteDone<T=TExTestEvent> = TExTestEvent & {
  tests: T[]
}

export type TExTestSuiteFinished<T=TExTestEvent> = TExTestEvent & {
  describes: T[]
}

export type TExEnded = TExamEvt<Record<string, any>>
export type TExStarted = TExamEvt<Record<string, any>>
export type TExResult = TExamEvt<TExSuiteResult[]>

export type TExSpecDone = TExamEvt<TExTestDone>
export type TExSpecStart = TExamEvt<TExTestStart>

export type TExSuiteStart = TExamEvt<TExTestEvent>
export type TExSuiteDone = TExamEvt<TExTestSuiteDone<TExTestResult>>
export type TExSuiteResult = TExamEvt<
  TExTestSuiteFinished<TExTestSuiteDone<TExTestResult>>
>

export type TExTestEventMeta = TExEnded
  | TExStarted
  | TExResult
  | TExSpecDone
  | TExSpecStart
  | TExSuiteStart
  | TExSuiteDone
  | TExSuiteResult
