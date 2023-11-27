
import type { TExamEvt } from './exam.types'
import type { TExFileModelDef } from './file.types'
import type {
  TTestStats,
  EAstObject,
  TRunResult,
  EResultAction,
  EResultStatus,
} from '@ltipton/parkin'

export type TRunResultMeta = {
  file?:Partial<TExFileModelDef>
}


export type TExResultType = TRunResult[`type`]
export type TExRunResult = Omit<TRunResult, `metadata`|`describes`|`tests`|`status`> & {
  id:string
  testPath?:string
  location?:string
  timestamp:number
  stats:TTestStats
  htmlReport?:string
  description?:string
  tests?:TExRunResult[]
  status: EResultStatus
  metaData?:TRunResultMeta
  describes?:TExRunResult[]
  eventParent?:TEventParent
  action:EResultAction|`error`
  type:TExResultType|EPlayerTestType
}


export enum EPlayerTestType {
  test=`test`,
  exam=`exam`,
  error=`error`,
  feature=`feature`,
  describe=`describe`,
  ended=`exam-ended`,
  stopped=`exam-stopped`,
}

export type TExEvtAction = EResultAction|`error`|`ended`|`stopped`|``


export type TExTestExpectation = {
  type:string
  message:string
}

export type TEventParent = EAstObject.step
  | EAstObject.scenario
  | EAstObject.background
  | EAstObject.rule
  | EAstObject.feature
  | `exam`

export type TExTestStart = Omit<TExRunResult, `type`|`action`|`status`> & {
  status:EResultStatus
  type:EPlayerTestType.test
  eventParent?: TEventParent
  action:EResultAction.start
}

export type TExTestDone = Omit<TExRunResult, `type`|`action`|`status`> & {
  status:EResultStatus
  type:EPlayerTestType.test
  eventParent?: TEventParent
  action:EResultAction.end
}

export type TExTestResult = Omit<TExRunResult, `type`|`action`|`status`> & {
  status:EResultStatus
  type:EPlayerTestType.test
  eventParent?: TEventParent
  action:EResultAction.test
}

export type TExTestEvent = Omit<TExRunResult, `type`|`action`|`status`> & {
  type:EPlayerTestType
  action:TExEvtAction
  status?:EResultStatus
  eventParent?: TEventParent
}

export type TEXErrorResult = Omit<TExRunResult, `type`|`action`|`status`> & {
  error:Error
  action:`error`
  eventParent?:TEventParent
  status:EResultStatus.failed
  type:EPlayerTestType.error|EAstObject.error
}

export type TExEndedEvent = Omit<TExRunResult, `type`|`action`|`status`> & {
  eventParent?:`exam`
  action:TExEvtAction
  type:EPlayerTestType.exam
}

export type TExEventData = TExTestEvent
  | TExTestStart
  | TExTestDone
  | TExTestResult
  | TEXErrorResult
  | TExTestSuiteDone
  | TExTestSuiteFinished
  | TExRunResult


export type TExTestSuiteDone<T=TExTestEvent> = TExTestEvent & {
  tests: T[]
}

export type TExTestSuiteFinished<T=TExTestEvent> = TExTestEvent & {
  describes: T[]
}

export type TExEnded = TExamEvt<Record<string, any>>
export type TExStarted = TExamEvt<Record<string, any>>

export type TExSpecDone = TExamEvt<TExTestDone>
export type TExSpecStart = TExamEvt<TExTestStart>

export type TExSuiteStart = TExamEvt<TExTestEvent>
export type TExSuiteDone = TExamEvt<TExTestSuiteDone<TExTestResult>>
export type TExSuiteResult = TExamEvt<
  TExTestSuiteFinished<TExTestSuiteDone<TExTestResult>>
>

export type TExTestEventMeta = TExEnded
  | TExStarted
  | TExSpecDone
  | TExSpecStart
  | TExSuiteStart
  | TExSuiteDone
  | TExSuiteResult
