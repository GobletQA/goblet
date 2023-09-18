 import type {
  TExamEvt,
  TExamConfig,
  TExEventData,
  IExamReporter,
  TExReporterCfg,
  TEXInterReporterContext,
} from "@gobletqa/exam"

import { Logger } from "@gobletqa/exam"

export type TLocEvt = (TExEventData & { location:string })

const logEvt = (evt:TExamEvt<TLocEvt>, logSplit:string) => {
  Logger.stdout(`${JSON.stringify(evt)}${logSplit}`)
}

export class FeatureJsonReporter implements IExamReporter {
  rootDir:string
  logSplit?:string

  constructor(
    examCfg:TExamConfig,
    cfg:TExReporterCfg,
    reporterContext?:TEXInterReporterContext
  ) {
    this.rootDir = examCfg.rootDir
    this.logSplit = cfg?.logSplit
  }

  onTestFileStart = (evt:TExamEvt<TLocEvt>) => logEvt(evt, this.logSplit)
  onTestFileResult = (evt:TExamEvt<TLocEvt>) => logEvt(evt, this.logSplit)
  onSuiteStart = (evt:TExamEvt<TLocEvt>) => logEvt(evt, this.logSplit)
  onTestStart = (evt:TExamEvt<TLocEvt>) => logEvt(evt, this.logSplit)
  onTestResult = (evt:TExamEvt<TLocEvt>) => logEvt(evt, this.logSplit)
  onSuiteResult = (evt:TExamEvt<TLocEvt>) => logEvt(evt, this.logSplit)

}

export default FeatureJsonReporter