import { EStepKey } from './features.types'
import { EPlayerTestType } from './exam.types'
import type {
  EResultAction,
  EResultStatus,
} from '@ltipton/parkin'

export type TTestRunId = string
export type TFileLocation = string
export type TEventUUID = string
export type TTestRunMetaType = EStepKey|`scenario`|`rule`|`background`|`feature`
export type TTestRunEvtStatus = EResultStatus|`running`|`loading`|`unknown`|`canceled`

export enum ETestType {
  bdd=`bdd`,
  unit=`unit`,
  feature=`feature`,
  waypoint=`waypoint`,
}


export type TTestRunEvent = {
  runId:TTestRunId
  id:string
  uuid:string
  name?:string
  text?:string
  failed?:boolean
  passed?:boolean
  skipped?:boolean
  description:string
  stats?:TTestRunStats
  type:EPlayerTestType
  action:EResultAction
  location:TFileLocation
  status?:TTestRunEvtStatus
  metaType?:TTestRunMetaType
  error?:boolean
  groupId?:string
  socketId?:string
  fullTestRun?:boolean
  procId?:number|string
  timestamp:string|number
  runTimestamp:string|number
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


export type TTestRun = {
  runId:TTestRunId
  canceled?:boolean
  finished?:boolean
  runError?:TTestRunEvent
  status?:TTestRunEvtStatus
  files: Record<TFileLocation, TTestRunFileData>
}
export type TTestRuns = Record<TTestRunId, TTestRun>
