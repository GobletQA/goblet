import type { TFeatureAst, TParkinRunStepOptsMap } from '@ltipton/parkin'
import type {
  Repo,
  TBrowser,
  TPlayerOpts,
  TBrowserPage,
  TPlayerEvent,
  TPlayerConfig,
  TPlayerEventCB,
  TBrowserContext,
  TPlayerCleanupCB,
  TPlayerStartConfig,
} from '@GBB/types'

import { CodeRunner } from './codeRunner'
import { noOp } from '@keg-hub/jsutils/noOp'
import { TestsToSocketEvtMap } from '@GBB/constants'
import { checkCall } from '@keg-hub/jsutils/checkCall'
import { deepMerge } from '@keg-hub/jsutils/deepMerge'
import { getInjectScript } from '@GBB/utils/getInjectScript'

/**
 * @type Player
 * @property {string} id - Id of the recorder instants
 * @property {function[]} onEvents - Callback methods called when an event is fired
 * @property {Object} page - Playwright page instance
 * @property {Object} context - Playwright context instance
 * @property {Object} browser - Playwright browser instance
 * @property {function} onCleanup - Called when the cleanup / stop methods are called
 * @property {Object} options - Custom options used while recording
 * @property {Object} options.highlightStyles - Custom styles for the highlighter
 */
export class Player {

  repo:Repo
  id:string = null
  browser:TBrowser
  page:TBrowserPage
  codeRunner:CodeRunner
  canceled:boolean=false
  playing:boolean = false
  context:TBrowserContext
  steps?:TParkinRunStepOptsMap
  onEvents:TPlayerEventCB[] = []
  onCleanup:TPlayerCleanupCB = noOp
  options:TPlayerOpts = {} as TPlayerOpts

  static isPlaying:boolean = false

  constructor(config:TPlayerConfig, id:string) {
    this.id = id
    this.setupPlayer(config)
  }

  /**
   * Loops the registered event methods and calls each one passing in the event object
   * Ensures the current recording state is added and upto date
   * @member {Recorder}
   */
  fireEvent = (event:Omit<TPlayerEvent, 'isPlaying'>) => {
    if(this.canceled) return this
    
    this.onEvents.map(func => checkCall(func, {
      ...event,
      isPlaying: Player.isPlaying,
      location: this.options?.file?.location,
      fileType: this.options?.file?.fileType,
      data: {
        ...event?.data,
        location: event?.data?.location ?? this.options?.file?.location,
      },
    }))

    return this
  }

  /**
   * Initializes the recorder
   * Ensures only the properties that are passed in are added to the Recorder 
   * @member {Recorder}
   */
  setupPlayer = (config:TPlayerConfig) => {
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
   * @member {Recorder}
   * @type {function}
   */
  addInitScripts = async () => {
    try {
      await this.page.exposeFunction(`isGobletPlaying`, this.onIsPlaying)
      
      await this.page.addInitScript({
        content: getInjectScript([`mouseHelper`])
      })
    }
    catch(err){
      // console.log(`------- Playing addInitScripts Error -------`)
      // console.error(err.stack)
    }
  }

  /**
   * Starts recording dom events by injecting scripts browser context
   * @member {Recorder}
   * @type {function}
   */
  start = async (startCof:TPlayerStartConfig) => {
    const { url, ...config } = startCof

    try {
  
      if(Player.isPlaying){
        this.fireEvent({ name: TestsToSocketEvtMap.error, message: 'Playing already inprogress' })
        console.warn('Browser playing already in progress')
        return this
      }

      Player.isPlaying = true
      this.setupPlayer(config)

      if(!this.page)
        throw new Error(`A Playwright page instance is required, but does not exist.`)

      await this.addInitScripts()

      this.fireEvent({
        message: 'Playing started',
        name: TestsToSocketEvtMap.started,
      })

      const timeout = this.options?.playOptions?.testTimeout as number
      const suiteTimeout = this.options?.playOptions?.suiteTimeout as number
      this.page.setDefaultTimeout(timeout || 15000)

      const extraHTTPHeaders = this.repo?.world?.$context?.extraHTTPHeaders
      extraHTTPHeaders &&
        await this.page.setExtraHTTPHeaders({...extraHTTPHeaders})

      this.codeRunner = new CodeRunner(this, {
        timeout,
        suiteTimeout,
        debug: this.options?.playOptions?.debug as boolean,
        slowMo: this.options?.playOptions?.slowMo as number,
      })

      // TODO: fix `feature` to come from a constant
      const content = this.options?.file?.fileType === `feature`
        ? this.options?.file?.ast as TFeatureAst | TFeatureAst[]
        : this.options?.file?.content

      const results = await this.codeRunner.run(content, this.steps)

      !this.canceled
        && this.fireEvent({
            data: results,
            message: 'Player results',
            name: TestsToSocketEvtMap.results,
          })

    }
    catch(err){
      if(!this.canceled){
        console.error(err.stack)
        this.fireEvent({
          message: err.message,
          name: TestsToSocketEvtMap.error,
        })
      }
    }
    finally {
      this.codeRunner = undefined
      delete this.codeRunner

      return this.canceled ? this : await this.stop()
    }

  }

  /**
   * Stops recording dom events by removing the current page and creating a new one
   * @member {Recorder}
   * @type {function}
   */
  stop = async () => {
    try {
      if(!this.context || !Player.isPlaying)
        this.fireEvent({
          name: TestsToSocketEvtMap.error,
          message: `Playing context does not exist`
        })

      Player.isPlaying = false

      this.fireEvent({
        name: TestsToSocketEvtMap.ended,
        message: `Playing stopped`,
      })
    }
    catch(err){
      console.error(err.stack)

      this.fireEvent({
        name: TestsToSocketEvtMap.error,
        message: err.message,
      })
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
    return Player.isPlaying
  }

  cancel = async () => {
    this.fireEvent({
      name: TestsToSocketEvtMap.canceled,
      message: `Playing canceled`,
    })

    await this.codeRunner?.cancel?.()

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
    this.repo = undefined
    this.context = undefined
    this.browser = undefined
    this.codeRunner = undefined
    delete this.page
    delete this.repo
    delete this.context
    delete this.browser
    delete this.codeRunner
    this.options = {}
    this.onEvents = []
    Player.isPlaying = false

  }
}
