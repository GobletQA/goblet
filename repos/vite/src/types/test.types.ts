import type { FocusEvent } from 'react'
import type { TestCfgUpdaters } from '@components/TestRuns/RunTestOptions/TestCfgUpdaters'
import type {
  TTestRun,
  TTestRunId,
  TExamUIRun,
  TTestRunEvent,
  TTestRunEvtStats,
  TTestRunEvtStatus,
} from './shared.types'


export type TTestRunUICfg = (TExamUIRun & {})
export type TTestCfgUpdaters = typeof TestCfgUpdaters
export type TOnChangeRunTestOpts = (args: any[], type: keyof TTestCfgUpdaters) => void
export type TOnBlurRunTestOpts = (evt: FocusEvent, type: keyof TTestCfgUpdaters) => void


export type TAddActiveTestRunEvts = {
  event?: TTestRunEvent
  events?: TTestRunEvent[]
}
export type TAddTestRunEvts = TAddActiveTestRunEvts & {
  runId:TTestRunId
}

export type TAddTestRun = {
  data:TTestRun
  runId:TTestRunId
}

export type TUpsertTestRun = {
  active?:boolean
  runId:TTestRunId
  data:Partial<TTestRun>
}



export type TTestRunsSections = keyof typeof ETestRunsSection
export enum ETestRunsSection {
  testRuns=`testRuns`,
  reporter=`reporter`,
  runOptions=`runOptions`,
}

export type TTestRunEventState = {
  className:string
  stats:TTestRunEvtStats
  status:TTestRunEvtStatus
}


export enum ETREvtType {
  file=`file`,
  step=`step`,
  parent=`parent`,
  feature=`feature`,
}