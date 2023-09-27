import type { FocusEvent } from 'react'
import type { TestCfgUpdaters } from '@components/TestRuns/TestCfgUpdaters'
import type {
  TTestRun,
  TTestRunId,
  TExamUIRun,
  TTestRunEvent,
  TTestRunStats,
  TTestRunEvtStatus,
} from './shared.types'


export type TTestRunUICfg = (TExamUIRun & {})
export type TTestCfgUpdaters = typeof TestCfgUpdaters
export type TOnChangeTestCfg = (args: any[], type: keyof TTestCfgUpdaters) => void
export type TOnBlurTestCfg = (evt: FocusEvent, type: keyof TTestCfgUpdaters) => void


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


export type TTestRunsSections = keyof typeof ETestRunsSection
export enum ETestRunsSection {
  testRuns=`testRuns`,
  reporter=`reporter`,
  runOptions=`runOptions`,
}

export type TTestRunEventState = {
  className:string
  stats:TTestRunStats
  status:TTestRunEvtStatus
}
