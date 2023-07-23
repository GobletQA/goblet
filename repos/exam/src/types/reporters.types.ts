import type { TExEventData } from './results.types'
import type { IConstructable } from './helpers.types'

export interface IExamReporter {
  cancel: () => void|Promise<void>
  cleanup: () => void|Promise<void>

  onSpecStarted(result:TExEventData):void
  onSpecDone(result:TExEventData):void

  onSuiteStarted(result:TExEventData):void
  onSuiteDone(result:TExEventData):void
}


export type IExReporter<I extends IExamReporter=IExamReporter> = I & IExamReporter

export type TReporterCls = IConstructable<IExReporter>
