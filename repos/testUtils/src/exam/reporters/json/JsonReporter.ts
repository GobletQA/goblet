 import type {
  TExamEvt,
  TExamConfig,
  TExEventData,
  IExamReporter,
  TExReporterCfg,
  TEXInterReporterContext,
} from "@gobletqa/exam"

import { Logger } from "@gobletqa/exam"
import { ExamJsonReporterEvtSplit } from "@gobletqa/environment/constants"

export type TLocEvt = (TExEventData & { location:string })

const logEvt = (evt:TExamEvt<TLocEvt>) => {
  Logger.stdout(`${JSON.stringify(evt)}${ExamJsonReporterEvtSplit}`)
}

export class FeatureJsonReporter implements IExamReporter {
  rootDir:string
  hasStepErr?:boolean

  constructor(
    examCfg:TExamConfig,
    cfg:TExReporterCfg,
    reporterContext?:TEXInterReporterContext
  ) {
    this.rootDir = examCfg.rootDir
  }

  onTestFileStart = (evt:TExamEvt<TLocEvt>) => logEvt(evt)
  onTestFileResult = (evt:TExamEvt<TLocEvt>) => logEvt(evt)
  onSuiteStart = (evt:TExamEvt<TLocEvt>) => logEvt(evt)
  onTestStart = (evt:TExamEvt<TLocEvt>) => logEvt(evt)
  onTestResult = (evt:TExamEvt<TLocEvt>) => logEvt(evt)
  onSuiteResult = (evt:TExamEvt<TLocEvt>) => logEvt(evt)

}

export default FeatureJsonReporter