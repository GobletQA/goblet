 import type {
  TExamEvt,
  TExamConfig,
  TExEventData,
  IExamReporter,
} from "@gobletqa/exam"
import {ife} from "@keg-hub/jsutils/ife"
import {isStr} from "@keg-hub/jsutils/isStr"
import {nanoid} from "@keg-hub/jsutils/nanoid"
import {EResultStatus} from '@ltipton/parkin'
import {emptyArr} from "@keg-hub/jsutils/emptyArr"


type TEvt = TExamEvt<TExEventData & { location?:string }>
export type TEvtCB = ((evt:TEvt) => any) & {
  name?:string
}
export type TRmCB = (() => any) & {
  name?:string
}

type TListeners = Record<string, TEvtCB[]>

class EvtReporter {
  config:TExamConfig
  #listeners:TListeners={}

  /**
   * Path location of the current test file being run 
   */
  #testPath?:string

  /**
   * Holds the path of a test mapped to its current run results
   */
  #failedSpecMap = {}

  getTestPath = () => this.#testPath

  getResult = (loc:string) => {
    return this.#failedSpecMap[loc]
  }

  setConfig = (config:TExamConfig) => {
    this.config = config
  }

  setFailed = (evt:TEvt) => {
    // TODO: Fix this, should not need to store this
    // Should use the active event data
    this.#testPath = evt?.data?.location

    evt?.data?.location
      && (this.#failedSpecMap[evt.data.location] = evt.data)
  }

  on = (evt:string, cb:TEvtCB, key?:string):TRmCB => {
    if(!cb.name) cb.name = key || nanoid()
    
    this.#listeners[evt] = this.#listeners[evt] || []
    this.#listeners[evt].push(cb)

    const remove =  () => this.off(evt, cb, cb.name)
    remove.name = cb.name

    return remove
  }

  off = (evt:string, callback:string|TEvtCB, key?:string) => {
    if(!this.#listeners[evt])
      throw new Error(`Cannot remove ${evt} event, ${evt} is not a valid event type`)

    if(isStr(callback) && !key) key = callback

    this.#listeners[evt] = this.#listeners[evt].filter(cb => key ? cb.name !== key : cb !== callback)
  }

  dispatch = (evt:TEvt) => {
    const event = {...evt, location: evt?.location || evt?.data?.location}

    const callbacks = [...this.#listeners[evt.name] || emptyArr]
    callbacks?.length
      && ife(async () => await Promise.all(callbacks.map(cb => cb(event))))
  }

  onCancel = (evt:any) => {
    this.dispatch({
      name:`onCancel`,
      isRunning:false
    })
  }

  cleanup = () => {
    this.dispatch({
      name:`cleanup`,
      isRunning:false
    })

    this.#listeners = undefined
    this.#listeners = {}
    this.#testPath = undefined
  }
}

export const evtReporter = new EvtReporter()

/**
 * Maps events to local instance of EvtReporter
 * Which is a singleton and allows for other methods to interact with it
 * It allows them to register event callbacks external to the reporter
 */
export class EventReporter implements IExamReporter {

  constructor(examCfg:TExamConfig) {
    evtReporter.setConfig(examCfg)
  }

  onTestFileResult = (evt:TEvt) => {
    evt?.data?.status === EResultStatus.failed
      && evtReporter.setFailed(evt)

    evtReporter.dispatch(evt)
  }

  onRunStart = (evt:TExamEvt<TExEventData>) => {
    // TODO: Start tracing and video
    evtReporter.dispatch(evt)
  }
  onRunResult = (evt:TEvt) => {
    // TODO: Stop tracing and video
    evtReporter.dispatch(evt)
  }
  onTestFileStart = (evt:TEvt) => evtReporter.dispatch(evt)
  onSuiteStart = (evt:TEvt) => evtReporter.dispatch(evt)
  onTestStart = (evt:TEvt) => evtReporter.dispatch(evt)
  onTestResult = (evt:TEvt) => evtReporter.dispatch(evt)
  onSuiteResult = (evt:TEvt) => evtReporter.dispatch(evt)
  cleanup = () => evtReporter.cleanup()
  onError = (evt:any) => evtReporter.dispatch(evt)
  onCancel = (evt:any) => evtReporter.dispatch(evt)
  onWarning = (evt:any) => evtReporter.dispatch(evt)

}

export default EventReporter

