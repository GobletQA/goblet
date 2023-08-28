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
import {getRelativeLoc} from "@GTU/Utils/getRelativeLoc"



type TEvt = TExamEvt<TExEventData>
type TEvtCB = ((evt:TEvt) => any) & {
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

  getResult = (loc:string) => this.#failedSpecMap[loc]

  setConfig = (config:TExamConfig) => {
    this.config = config
  }
  
  setTestPath = (testPath:string) => {
    this.#testPath = testPath
      ? getRelativeLoc(testPath, this.config?.rootDir)
      : testPath
  }

  setFailed = (evt:TEvt) => {
    this.#failedSpecMap[this.#testPath] = evt.data
  }

  on = (evt:string, cb:TEvtCB, key?:string) => {
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
    const event = {
      ...evt,
      // TODO: figure out how to ensure the correct file location
      location: evt.location || ``,
    }

    const callbacks = [...this.#listeners[evt.name] || emptyArr]
    callbacks?.length
      && ife(async () => await Promise.all(callbacks.map(cb => cb(evt))))
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

  onRunStart = (evt:TExamEvt<TExEventData>) => {
    const testPath = evt?.data?.testPath
    testPath
      && evtReporter.setTestPath(evt?.data?.testPath)

    evtReporter.dispatch(evt)
  }
  onTestFileResult = (evt:TEvt) => {
    evt?.data?.status === EResultStatus.failed
      && evtReporter.setFailed(evt)

    evtReporter.dispatch(evt)
  }
  onRunComplete = (evt:TEvt) => {
    evtReporter.dispatch(evt)
    // Once the test finishes, reset the testPath
    evtReporter.setTestPath(undefined)
  }
  onTestFileStart = (evt:TEvt) => evtReporter.dispatch(evt)
  onTestStart = (evt:TEvt) => evtReporter.dispatch(evt)
  onTestCaseStart = (evt:TEvt) => evtReporter.dispatch(evt)
  onTestCaseResult = (evt:TEvt) => evtReporter.dispatch(evt)
  onTestResult = (evt:TEvt) => evtReporter.dispatch(evt)
  cleanup = () => evtReporter.cleanup()
  onError = (evt:any) => evtReporter.dispatch(evt)
  onCancel = (evt:any) => evtReporter.dispatch(evt)
  onWarning = (evt:any) => evtReporter.dispatch(evt)

}

export default EventReporter

