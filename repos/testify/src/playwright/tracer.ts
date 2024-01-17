 import type { TExamEvt, TExEventData } from "@gobletqa/exam"
 import type { TRmCB } from '@GTU/Exam/reporters/event/EventReporter'
import type {
  TGobletTestOpts,
  TBrowserContext,
} from '@GTU/Types'

import path from 'path'
import { Logger } from "@gobletqa/logger"
import { set } from '@keg-hub/jsutils/set'
import { emptyObj } from '@keg-hub/jsutils/emptyObj'
import { shouldSaveArtifact } from '@GTU/Utils/artifactSaveOption'
import { TestsToSocketEvtMap } from '@gobletqa/environment/constants'
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
    this.disabled = Boolean(!global?.__goblet?.options?.tracing)
    if(this.disabled) return this

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
      TestsToSocketEvtMap.suiteDoneRoot,
      async (evt:TExamEvt<TExEventData>) => await this.stop(evt, this.context)
    ))
  }


  /**
   * Starts tracing on the browser context
   * @param {Object} [context] - Browser context to start tracing on
   *
   * @returns <boolean|void>
   */
  start = async (context:TBrowserContext=this.context || global.context) => {
    try {
      if(context && !this.context) this.context = context
      if(this.disabled || !this.context) return

      const tracingStarted = this.context?.__contextGoblet?.tracingStarted

      if(!tracingStarted){
        await this.context.tracing.start(global?.__goblet?.options?.tracing ?? emptyObj)
        this.context.__contextGoblet ||= {}
        this.context.__contextGoblet.tracingStarted = true
      }

      await this.context.tracing.startChunk()
      this.context.__contextGoblet ||= {}
      this.context.__contextGoblet.tracing = true

      return true
    }
    catch(err){
      Logger.error(`Tracing failed to start`)
      Logger.log(err)

      return false
    }
  }

  /**
   * Starts tracing on the browser context
   * @param {Object} context - Browser context to stop a tracing chunk
   *
   * @returns {Void}
   */
  stop = async (
    evt?:TExamEvt<TExEventData>,
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
    } = (global?.__goblet?.options ?? emptyObj) as TGobletTestOpts

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

    context && (set(context, [`__contextGoblet`, `tracing`], false))
    this.context = undefined
  }

}
