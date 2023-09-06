 import type { TExamEvt, TLocEvtData } from "@gobletqa/exam"
 import type { TRmCB } from '@GTU/Exam/reporters/event/EventReporter'
import type {
  TGobletTestOpts,
  TBrowserContext,
  TGobletGlobalBrowserOpts,
} from '@GTU/Types'

import path from 'path'
import { Logger } from "@gobletqa/logger"
import { get } from '@keg-hub/jsutils/get'
import { set } from '@keg-hub/jsutils/set'
import { emptyObj } from '@keg-hub/jsutils/emptyObj'
import { ExamEvtNames } from '@gobletqa/environment/constants'
import { shouldSaveArtifact } from '@GTU/Utils/artifactSaveOption'
import { evtReporter } from '@GTU/Exam/reporters/event/EventReporter'
import {
  getGeneratedName,
  copyArtifactToRepo,
  ensureRepoArtifactDir,
} from '@GTU/Playwright/generatedArtifacts'


export class TraceRecorder {
  static tracer:TraceRecorder

  /**
   * TraceRecorder is a singleton
   * There should only ever be on instance
   * So use `TraceRecorder.get()` Instead of `new TraceRecorder()`
   */
  static get = () => {
    if (this.tracer) return this.tracer
    this.tracer = new TraceRecorder()

    return this.tracer
  }
  
  disabled?:boolean
  evtHandlers:TRmCB[] = []
  context:TBrowserContext
  
  constructor(context?:TBrowserContext){
    if(TraceRecorder.tracer) return TraceRecorder.tracer

    this.context = context || global.context
    this.disabled = Boolean(!get(global, `__goblet.options.tracing`))
    this.register()
  }

  /**
   * Initializes tracing on the Browser context object
   *
   * @returns {Void}
   */
  register = (
    context:TBrowserContext=global.context
  ) => {
    if(this.disabled) return
    if(context && !this.context) this.context = context

    if(this.evtHandlers.length){
      Logger.warn(`Tracing event handlers have already been registered`)
      return
    }

    this.evtHandlers.push(evtReporter.on(
      ExamEvtNames.started,
      async (evt:TExamEvt<TLocEvtData>) => await this.startChunk(evt, this.context)
    ))

    this.evtHandlers.push(evtReporter.on(
      ExamEvtNames.results,
      async (evt:TExamEvt<TLocEvtData>) => await this.stopChunk(evt, this.context)
    ))
  }


  /**
   * Starts tracing on the browser context
   * @param {Object} [context] - Browser context to start tracing on
   *
   * @returns <boolean|void>
   */
  start = async (context:TBrowserContext=this.context || global.context) => {
    if(this.disabled || !context) return

    if(context && !this.context) this.context = context
    const traceOpts = get(global, `__goblet.options.tracing`, emptyObj)
    await context.tracing.start(traceOpts)

    return true
  }

  /**
   * Starts tracing on the browser context
   * @param {Object} [context] - Browser context to start a tracing chunk
   *
   * @returns <boolean|void>
   */
  startChunk = async (
    evt?:TExamEvt<TLocEvtData>,
    context:TBrowserContext=this.context || global.context,
  ) => {

    console.log(`------- STARTING chunk tracing -------`)
    console.log(evt)

    /**
     * Need to check if the tracing has already started on the browser context
     * So there's an additional check of `context?.__contextGoblet?.tracing`
     */
    if(this.disabled || !context || context?.__contextGoblet?.tracing) return

    await context.tracing.startChunk()
    set(context, [`__contextGoblet`, `tracing`], true)

    return true
  }


  /**
   * Starts tracing on the browser context
   * @param {Object} context - Browser context to stop a tracing chunk
   *
   * @returns {Void}
   */
  stopChunk = async (
    evt?:TExamEvt<TLocEvtData>,
    context:TBrowserContext=this.context || global.context,
  ) => {

    if(!evt.data)
      return Logger.warn(`Can not chunk tracing, missing event data`)

    const { location, status } = evt.data

    /**
     * Need to check if the tracing has already stopped on the browser context
     * So there's an additional check of `!context?.__contextGoblet?.tracing`
     */
    if(this.disabled || !context || !context?.__contextGoblet?.tracing) return

    const {
      testType,
      saveTrace,
      // Path to the mounted repo where traces should be saved
      tracesDir:repoTracesDir,
    } = get<TGobletTestOpts>(
      global,
      `__goblet.options`,
      emptyObj as TGobletTestOpts
    )

    const {
      dir,
      full,
      testPath,
      nameTimestamp,
    } = getGeneratedName(location, testType || undefined)

    if(!testPath){
      set(context, [`__contextGoblet`, `tracing`], false)
      return false
    }

    const shouldSave = shouldSaveArtifact(saveTrace, status)

    if(!shouldSave){
      set(context, [`__contextGoblet`, `tracing`], false)
      return
    }

    const {
      // Path to the temp directory where traces are saved by the browser
      tracesDir,
      type:browser=`browser`
    } = get<TGobletGlobalBrowserOpts>(
      global,
      `__goblet.browser`,
      emptyObj as TGobletGlobalBrowserOpts
    )

    const traceLoc = path.join(tracesDir, `${full}.zip`)
    await context.tracing.stopChunk({ path: traceLoc })

    const saveDir = await ensureRepoArtifactDir(repoTracesDir, dir)
    set(context, [`__contextGoblet`, `tracing`], false)

    return await copyArtifactToRepo(saveDir, nameTimestamp, traceLoc)
  }

  /**
   * Helper to check is tracing is disabled
   *
   * @returns boolean
   */
  isDisabled = () => {
    const tracing = get(global, `__goblet.options.tracing`)
    return Boolean(!tracing)
  }


  clean = (context:TBrowserContext=this.context || global.context) => {
    if(this.disabled) return
    
    try { this.evtHandlers.forEach(cb => cb?.()) }
    catch(err){}
    this.evtHandlers = []

    context && set(context, [`__contextGoblet`, `tracing`], false)
    this.context = undefined
  }

}

/**
 * Is a side-effect that a new Tracer instance will be created when the file is imported
 * The constructor call the register method, which registers events with the Event Reporter
 * So as soon as this file is imported, the events are auto-registered
 */
export const Tracer = TraceRecorder.get()