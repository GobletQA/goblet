import type { TExamEvt } from '@GEX/types'
import type { TFeatureAst, TParkinRunStepOptsMap } from '@ltipton/parkin'
import type {
  TRepo,
  TBrowser,
  TPlayerOpts,
  TBrowserPage,
  TPlayerConfig,
  TPlayerEventCB,
  TBrowserContext,
  TPlayerCleanupCB,
  TPlayerStartConfig,
} from '@gobletqa/shared/types'

import { DomScripts } from '@GEX/services/DomScripts'
import { ExamEvtNames, ExamEvents } from '@GEX/constants'
import {noOp, checkCall, deepMerge} from '@keg-hub/jsutils'

/**
 * @type Exam
 */
export class Exam {

  repo:TRepo
  browser:TBrowser
  id:string = null
  page:TBrowserPage
  domScripts:DomScripts
  canceled:boolean=false
  playing:boolean = false
  context:TBrowserContext
  steps?:TParkinRunStepOptsMap
  onEvents:TPlayerEventCB[] = []
  onCleanup:TPlayerCleanupCB = noOp
  options:TPlayerOpts = {} as TPlayerOpts

  static isRunning:boolean = false

  constructor(config:TPlayerConfig, id:string) {
    this.id = id
    this.setup(config)
    this.domScripts = new DomScripts()
  }

  /**
   * Loops the registered event methods and calls each one passing in the event object
   * Ensures the current recording state is added and upto date
   * @member {Exam}
   */
  fireEvent = (event:TExamEvt) => {
    if(this.canceled) return this
    
    this.onEvents.map(func => checkCall(
      func,
      {
        ...event,
        isRunning: Exam.isRunning,
        location: this.options?.file?.location,
        fileType: this.options?.file?.fileType,
      }
    ))

    return this
  }

  /**
   * Initializes the recorder
   * Ensures only the properties that are passed in are added to the Recorder 
   * @member {Exam}
   */
  setup = (config:TPlayerConfig) => {
    const {
      page,
      repo,
      steps,
      context,
      browser,
      options,
      onEvent,
      onCleanup,
    } = config

    if(page) this.page = page
    if(repo) this.repo = repo
    if(steps) this.steps = steps
    if(context) this.context = context
    if(browser) this.browser = browser
    if(options) this.options = deepMerge(this.options, options)

    if(onEvent) this.onEvents.push(onEvent)
    if(onCleanup) this.onCleanup = onCleanup

    return this
  }


  /**
   * Adds the init scripts to the browser context
   * Scripts allows simulating mouse movement
   * @member {Exam}
   */
  addInitScripts = async () => {
    try {
      await this.page.exposeFunction(`isGobletPlaying`, this.onIsPlaying)
      
      await this.page.addInitScript({
        content: this.domScripts.get(`mouseHelper`)
      })
    }
    catch(err){
      // console.log(`------- Playing addInitScripts Error -------`)
      // console.error(err.stack)
    }
  }

  /**
   * Starts recording dom events by injecting scripts browser context
   * @member {Exam}
   */
  start = async (startCof:TPlayerStartConfig) => {
    const { url, ...config } = startCof

    try {
  
      if(Exam.isRunning){
        this.fireEvent(ExamEvents.alreadyPlaying)
        console.warn('Browser playing already in progress')
        return this
      }

      Exam.isRunning = true
      this.setup(config)
      

    }
    catch(err){
      if(!this.canceled){
        console.error(err.stack)
        this.fireEvent(
          ExamEvents.dynamic({
            message: err.message,
            name: ExamEvtNames.error,
          })
        )
      }
    }
    finally {
      return this.canceled ? this : await this.stop()
    }

  }

  /**
   * Stops recording dom events by removing the current page and creating a new one
   * @member {Exam}
   */
  stop = async () => {
    try {
      if(!this.context || !Exam.isRunning)
        this.fireEvent(ExamEvents.missingContext)

      Exam.isRunning = false

      this.fireEvent(ExamEvents.ended)
    }
    catch(err){
      console.error(err.stack)

      this.fireEvent(
        ExamEvents.dynamic({
          message: err.message,
          name: ExamEvtNames.error,
        })
      )
    }
    finally {
      await this.cleanUp()
    }

    return this
  }

  /**
   * Called when a page loads to check if mouse tracker should run
   * Is called from within the browser context
   */
  onIsPlaying = () => {
    return Exam.isRunning
  }

  cancel = async () => {
    this.fireEvent(ExamEvents.canceled)

    // TODO: Fix this once runners are setup
    // await this.runner?.cancel?.()

    this.canceled = true
    await this.stop()

    return this
  }

  /**
   * Helper method to clean up when recording is stopped
   * Attempts to avoid memory leaks by un setting Recorder instance properties
   */
  cleanUp = async () => {
    try {
      await this.onCleanup(this)
    }
    catch(err){
      console.error(err)
    }

    this.page = undefined
    this.context = undefined
    this.browser = undefined
    delete this.page
    delete this.context
    delete this.browser
    this.options = {}
    this.onEvents = []
    Exam.isRunning = false

  }
}