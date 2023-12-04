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
  saveJsonEvents?:boolean
  #events:Record<string, Record<string, TExamEvt<TExEventData>>>={}

  constructor(
    examCfg:TExamConfig,
    cfg:TExReporterCfg,
    reporterContext?:TEXInterReporterContext
  ) {
    this.rootDir = examCfg.rootDir
    this.saveJsonEvents = cfg.saveJsonEvents
    this.logSplit = cfg?.logSplit || ENVS.EXAM_EVENT_LOG_SPLIT_KEY
  }

  #cacheEvt = (evt:TExamEvt<TExEventData>) => {
    if(!this.saveJsonEvents) return
    
    const loc = evt?.location ?? evt?.data?.location
    this.#events[loc] = this.#events[loc] || {}
    this.#events[loc][evt?.data?.id] = evt
  }

  onRunStart = (evt:TExamEvt<TExEventData>) => {
    this.#cacheEvt(evt)
    logEvt(evt, this.logSplit)
  }
  onRunResult = (evt:TExamEvt<TExEventData>) => {
    this.#cacheEvt(evt)
    logEvt(evt, this.logSplit)
  }
  onTestFileStart = (evt:TExamEvt<TExEventData>) => {
    this.#cacheEvt(evt)
    logEvt(evt, this.logSplit)
  }
  onTestFileResult = (evt:TExamEvt<TExEventData>) => {
    this.#cacheEvt(evt)
    logEvt(evt, this.logSplit)
  }
  onSuiteStart = (evt:TExamEvt<TExEventData>) => {
    this.#cacheEvt(evt)
    logEvt(evt, this.logSplit)
  }
  onTestStart = (evt:TExamEvt<TExEventData>) => {
    this.#cacheEvt(evt)
    logEvt(evt, this.logSplit)
  }
  onTestResult = (evt:TExamEvt<TExEventData>) => {
    this.#cacheEvt(evt)
    logEvt(evt, this.logSplit)
  }
  onSuiteResult = (evt:TExamEvt<TExEventData>) => {
    this.#cacheEvt(evt)
    logEvt(evt, this.logSplit)
  }
  onError = (evt:any) => {
    this.#cacheEvt(evt)
    logEvt(evt, this.logSplit)
  }
  
  onFinished = (evt:TExamEvt<TExEventData>) => {
    this.#events = {}
    // console.log(require('util').inspect(evt, false, null, true))
  }

}

export default FeatureJsonReporter