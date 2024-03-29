 import type {
  TExamEvt,
  TExamConfig,
  TExEventData,
  IExamReporter,
} from "@gobletqa/exam"
import {isStr} from "@keg-hub/jsutils/isStr"
import {nanoid} from "@keg-hub/jsutils/nanoid"
import {emptyArr} from "@keg-hub/jsutils/emptyArr"


export type TEvtCB = ((evt:TExamEvt<TExEventData>, config:TExamConfig) => any) & {
  callbackId?:string
}
export type TRmCB = (() => any) & {
  callbackId?:string
}

type TListeners = Record<string, TEvtCB[]>

class EvtReporter {
  config:TExamConfig
  #listeners:TListeners={}

  setConfig = (config:TExamConfig) => {
    this.config = config
  }


  on = (evt:string, cb:TEvtCB, key?:string):TRmCB => {
    if(!cb.callbackId) cb.callbackId = key || nanoid()
    this.#listeners[evt] = this.#listeners[evt] || []
    this.#listeners[evt].push(cb)

    const remove = () => this.off(evt, cb, cb.callbackId)
    remove.callbackId = cb.callbackId

    return remove
  }

  off = (evt:string, callback:string|TEvtCB, key?:string) => {
    if(!this.#listeners[evt])
      throw new Error(`Cannot remove ${evt} event, ${evt} is not a valid event type`)

    if(isStr(callback) && !key) key = callback

    this.#listeners[evt] = this.#listeners[evt].filter(
      cb => key
        ? cb.callbackId !== key
        : cb !== callback
    )
  }

  dispatch = async (evt:TExamEvt<TExEventData>) => {
    const event = {...evt, location: evt?.location || evt?.data?.location}
    // console.log(`Dispatching Evt:`, event.name)

    const callbacks = [...this.#listeners[evt.name] || emptyArr]
    return callbacks?.length
      && await Promise.all(callbacks.map(cb => cb(event, this.config)))
  }

  onCancel = (evt:any) => {
    return this.dispatch({
      name:`onCancel`,
      isRunning:false
    })
  }

  cleanup = () => {
    const resp = this.dispatch({
      name:`cleanup`,
      isRunning:false
    })

    this.#listeners = undefined
    this.#listeners = {}

    return resp
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

  onTestFileResult = (evt:TExamEvt<TExEventData>) => evtReporter.dispatch(evt)
  onRunStart = (evt:TExamEvt<TExEventData>) => evtReporter.dispatch(evt)
  onRunResult = (evt:TExamEvt<TExEventData>) => evtReporter.dispatch(evt)
  onTestFileStart = (evt:TExamEvt<TExEventData>) => evtReporter.dispatch(evt)
  onSuiteStart = (evt:TExamEvt<TExEventData>) => evtReporter.dispatch(evt)
  onTestStart = (evt:TExamEvt<TExEventData>) => evtReporter.dispatch(evt)
  onTestResult = (evt:TExamEvt<TExEventData>) => evtReporter.dispatch(evt)
  onSuiteResult = (evt:TExamEvt<TExEventData>) => evtReporter.dispatch(evt)
  cleanup = () => evtReporter.cleanup()
  onError = (evt:any) => evtReporter.dispatch(evt)
  onCancel = (evt:any) => evtReporter.dispatch(evt)
  onWarning = (evt:any) => evtReporter.dispatch(evt)

}

export default EventReporter

