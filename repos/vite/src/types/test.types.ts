import type { emptyObj } from '@keg-hub/jsutils'
import type { FocusEvent } from 'react'
import { EResultAction } from '@ltipton/parkin'
import type { TestCfgUpdaters } from '@components/TestRuns/TestCfgUpdaters'
import type {
  EStepKey,
  TExamUIRun,
  EPlayerTestType,
  EPlayerTestAction,
  EPlayerTestStatus,
} from './shared.types'

export type TTestRunUICfg = (TExamUIRun & {})

export type TTestCfgUpdaters = typeof TestCfgUpdaters
export type TOnChangeTestCfg = (args: any[], type: keyof TTestCfgUpdaters) => void
export type TOnBlurTestCfg = (evt: FocusEvent, type: keyof TTestCfgUpdaters) => void

export type TTestRunId = string
export type TFileLocation = string
export type TEventUUID = string
export type TTestRunMetaType = EStepKey|`scenario`|`rule`|`background`|`feature`
export type TTestRunEvtStatus = EPlayerTestStatus|`running`|`loading`|`unknown`

export type TTestRunEvent = {
  runId:TTestRunId
  id:string
  uuid:string
  text?:string
  failed?:boolean
  passed?:boolean
  skipped?:boolean
  timestamp:number
  description:string
  stats?:TTestRunStats
  type:EPlayerTestType
  location:TFileLocation
  status?:TTestRunEvtStatus
  metaType?:TTestRunMetaType
  action:EPlayerTestAction|EResultAction
}

export type TTestRunEndEvent = {
  runId:TTestRunId
  id:string
  name?:string
  error?:boolean
  group?: string
  message?:string
  groupId?:string
  socketId?:string
  isRunning?:boolean
  fullTestRun?:boolean
  data?:typeof emptyObj
  procId?:number|string
  timestamp:string|number
  runTimestamp:string|number
}

export type TTestRunEventStages = {
  end?:TTestRunEvent
  start?:TTestRunEvent
  // other?:TTestRunEvent
  // TODO: validate these
  // test?:TTestRunEvent
  // abort?:TTestRunEvent
  // skipped?:TTestRunEvent
}

export type TTestRunEvents = {
  [key:TEventUUID]: TTestRunEventStages
}

export type TTestRunStats = {
  runEnd:number
  runStart:number
  failedSpecs:number
  passedSpecs:number
  passedSuites:number
  failedSuites:number
}

export type TTestRunFileData = {
  timestamp:number
  status?:string
  failed?:boolean
  passed?:boolean
  runId:TTestRunId
  stats:TTestRunStats
  location:TFileLocation
  events: TTestRunEvents
}


export type TAddActiveTestRunEvts = {
  event?: TTestRunEvent
  events?: TTestRunEvent[]
}
export type TAddTestRunEvts = TAddActiveTestRunEvts & {
  runId:TTestRunId
}

export type TTestRun = Record<TFileLocation, TTestRunFileData>
export type TTestRuns = Record<TTestRunId, TTestRun>

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
