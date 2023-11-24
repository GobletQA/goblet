 import type {
  TExamEvt,
  TExamConfig,
  TExEventData,
  IExamReporter,
  TExReporterCfg,
  TEXInterReporterContext,
} from "@gobletqa/exam"

import { Logger } from "@gobletqa/exam"
import { ENVS } from '@gobletqa/environment'
import {isObj} from "@keg-hub/jsutils/isObj"

const noCircles = (evt:TExamEvt<TExEventData>) => {
  let cache = []
  const evtStr = JSON.stringify(evt, (key, value) => {
    if (isObj(value)) {
      if (cache.includes(value)) return `[Circular]`
      cache.push(value)
    }
    return value
  })

  cache = null

  return evtStr
}

const logEvt = (evt:TExamEvt<TExEventData>, logSplit:string) => {
  Logger.stdout(`${logSplit}${noCircles(evt)}${logSplit}`)
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
    this.logSplit = cfg?.logSplit || ENVS.EXAM_EVENT_LOG_SPLIT_KEY
  }

  onRunStart = (evt:TExamEvt<TExEventData>) => logEvt(evt, this.logSplit)
  onRunResult = (evt:TExamEvt<TExEventData>) => logEvt(evt, this.logSplit)
  onTestFileStart = (evt:TExamEvt<TExEventData>) => logEvt(evt, this.logSplit)
  onTestFileResult = (evt:TExamEvt<TExEventData>) => logEvt(evt, this.logSplit)
  onSuiteStart = (evt:TExamEvt<TExEventData>) => logEvt(evt, this.logSplit)
  onTestStart = (evt:TExamEvt<TExEventData>) => logEvt(evt, this.logSplit)
  onTestResult = (evt:TExamEvt<TExEventData>) => logEvt(evt, this.logSplit)
  onSuiteResult = (evt:TExamEvt<TExEventData>) => logEvt(evt, this.logSplit)
  onError = (evt:any) => logEvt(evt, this.logSplit)

}

export default FeatureJsonReporter