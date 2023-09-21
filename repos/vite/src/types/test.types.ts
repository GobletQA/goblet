import type { FocusEvent } from 'react'
import type { TestCfgUpdaters } from '@components/TestRuns/TestCfgUpdaters'
import {TPlayerResEvent} from './shared.types'

export type TTestCfgUpdaters = typeof TestCfgUpdaters
export type TOnChangeExam = (args: any[], type: keyof TTestCfgUpdaters) => void
export type TOnBlurExam = (evt: FocusEvent, type: keyof TTestCfgUpdaters) => void


export type TTestRuns = Record<string, TPlayerResEvent[]>
export type TAddTestRunEvt = {
  name:string
  event?: TPlayerResEvent
  events?: TPlayerResEvent[]
}


export type TTestRunsSections = keyof typeof ETestRunsSection
export enum ETestRunsSection {
  runs=`runs`,
  config=`config`,
  reporter=`reporter`,
}
