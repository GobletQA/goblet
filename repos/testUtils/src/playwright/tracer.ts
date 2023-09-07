 import type { TExamEvt, TLocEvtData } from "@gobletqa/exam"
 import type { TRmCB } from '@GTU/Exam/reporters/event/EventReporter'
import type {
  ETestType,
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

  disabled?:boolean
  evtHandlers:TRmCB[] = []
  context:TBrowserContext
  
  constructor(context?:TBrowserContext){
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
      ExamEvtNames.rootSuiteDone,
      async (evt:TExamEvt<TLocEvtData>) => await this.stop(evt, this.context)
    ))
  }


  /**
   * Starts tracing on the browser context
   * @param {Object} [context] - Browser context to start tracing on
   *
   * @returns <boolean|void>
   */
  start = async (context:TBrowserContext=this.context || global.context) => {
    if(context && !this.context) this.context = context
    if(this.disabled || !this.context) return

    const traceOpts = get(global, `__goblet.options.tracing`, emptyObj)
    await this.context.tracing.start(traceOpts)

    await this.context.tracing.startChunk()
    set(this.context, [`__contextGoblet`, `tracing`], true)

    return true
  }

  /**
   * Starts tracing on the browser context
   * @param {Object} context - Browser context to stop a tracing chunk
   *
   * @returns {Void}
   */
  stop = async (
    evt?:TExamEvt<TLocEvtData>,
    context:TBrowserContext=this.context || global.context,
  ) => {

    if(!evt.data)
      return Logger.warn(`Can not chunk tracing, missing event data`)

    const { location, status, timestamp } = evt.data

    /**
     * Need to check if the tracing has already stopped on the browser context
     * So there's an additional check of `!context?.__contextGoblet?.tracing`
     */
    if(this.disabled || !context || !context?.__contextGoblet?.tracing) return

    const {
      saveTrace,
      // Path to the mounted repo where traces should be saved
      tracesDir:repoTracesDir,
    } = get<TGobletTestOpts>(
      global,
      `__goblet.options`,
      emptyObj as TGobletTestOpts
    )

    if(!shouldSaveArtifact(saveTrace, status)){
      set(context, [`__contextGoblet`, `tracing`], false)
      return
    }

    const {
      dir,
      full,
      testLoc,
      nameTimestamp,
    } = getGeneratedName({ location, timestamp })

    if(!testLoc){
      set(context, [`__contextGoblet`, `tracing`], false)
      return false
    }

    // Path to the temp directory where traces are saved by the browser
    const tracesDir = global?.__goblet?.browser?.tracesDir || ``
    if(!tracesDir)
      return Logger.warn(`Can not save Trace Report, browser trace directory is not defined`)

    const traceLoc = path.join(tracesDir, `${full}.zip`)
    await context.tracing.stopChunk({ path: traceLoc })

    const saveDir = await ensureRepoArtifactDir(repoTracesDir, dir)
    set(context, [`__contextGoblet`, `tracing`], false)

    const savedLoc = await copyArtifactToRepo(saveDir, nameTimestamp, traceLoc)
    Logger.log(Logger.colors.gray(` - Trace Report saved for failed test`))
    
    
    return savedLoc
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
