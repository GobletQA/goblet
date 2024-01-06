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
import { stripAnsi } from '@GTU/Utils/stripAnsi'
import { rmCircular } from '@GTU/Utils/rmCircular'

export class FeatureJsonReporter implements IExamReporter {
  rootDir:string
  logSplit?:string=``
  stripAnsi?:boolean=true
  saveJsonEvents?:boolean
  #events:Record<string, Record<string, TExamEvt<TExEventData>>>={}

  constructor(
    examCfg:TExamConfig,
    cfg:TExReporterCfg,
    reporterContext?:TEXInterReporterContext
  ) {
    this.rootDir = examCfg.rootDir
    this.saveJsonEvents = cfg.saveJsonEvents
    if(cfg.stripAnsi === false) this.stripAnsi = false
    this.logSplit = cfg?.logSplit || ENVS.EXAM_EVENT_LOG_SPLIT_KEY
  }

  #cacheEvt = (evt:TExamEvt<TExEventData>) => {
    if(!this.saveJsonEvents) return

    const loc = evt?.location ?? evt?.data?.location
    this.#events[loc] = this.#events[loc] || {}
    this.#events[loc][evt?.data?.id] = evt
  }

  #logEvt = (evt:TExamEvt<TExEventData>) => {
    const formatted = rmCircular(evt)
    const cleaned = this.stripAnsi !== false ? stripAnsi(formatted) : formatted
    Logger.stdout(`${this.logSplit}${cleaned}${this.logSplit}`)
  }

  onRunStart = (evt:TExamEvt<TExEventData>) => {
    this.#cacheEvt(evt)
    this.#logEvt(evt)
  }
  onRunResult = (evt:TExamEvt<TExEventData>) => {
    this.#cacheEvt(evt)
    this.#logEvt(evt)
  }
  onTestFileStart = (evt:TExamEvt<TExEventData>) => {
    this.#cacheEvt(evt)
    this.#logEvt(evt)
  }
  onTestFileResult = (evt:TExamEvt<TExEventData>) => {
    this.#cacheEvt(evt)
    this.#logEvt(evt)
  }
  onSuiteStart = (evt:TExamEvt<TExEventData>) => {
    this.#cacheEvt(evt)
    this.#logEvt(evt)
  }
  onTestStart = (evt:TExamEvt<TExEventData>) => {
    this.#cacheEvt(evt)
    this.#logEvt(evt)
  }
  onTestResult = (evt:TExamEvt<TExEventData>) => {
    this.#cacheEvt(evt)
    this.#logEvt(evt)
  }
  onSuiteResult = (evt:TExamEvt<TExEventData>) => {
    this.#cacheEvt(evt)
    this.#logEvt(evt)
  }
  onError = (evt:any) => {
    this.#cacheEvt(evt)
    this.#logEvt(evt)
  }
  
  onFinished = (evt:TExamEvt<TExEventData>) => {
    this.#events = {}
  }

}

export default FeatureJsonReporter