import type {
  TRepo,
  TBrowser,
  TPlayerOpts,
  TBrowserPage,
  TPlayerEvent,
  TPlayerConfig,
  TPlayerEventCB,
  TBrowserContext,
  TPlayerCleanupCB,
  TPlayerStartConfig,
} from '@GSC/types'

import { PWPlay } from '@GSC/constants'
import { CodeRunner } from './codeRunner'
import {noOp, checkCall, deepMerge} from '@keg-hub/jsutils'
import { getInjectScript } from '../helpers/getInjectScript'


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

  repo:TRepo
  id:string = null
  browser:TBrowser
  page:TBrowserPage
  playing:boolean = false
  context:TBrowserContext
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
    this.onEvents.map(func => checkCall(
      func,
      {
        ...event,
        isPlaying: Player.isPlaying,
        location: this.options?.file?.location,
        fileType: this.options?.file?.fileType,
      }
    ))

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
      context,
      browser,
      options,
      onEvent,
      onCleanup,
    } = config

    if(page) this.page = page
    if(context) this.context = context
    if(browser) this.browser = browser
    if(options) this.options = deepMerge(this.options, options)
    if(repo) this.repo = repo

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
        this.fireEvent({ name: PWPlay.playError, message: 'Playing already inprogress' })
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
        name: PWPlay.playStarted,
      })

      const codeRunner = new CodeRunner(this)
      const results = await codeRunner.run(this.options?.file?.content)
      this.fireEvent({
        data: results,
        message: 'Player results',
        name: PWPlay.playResults,
      })

      return await this.stop()
    }
    catch(err){

      console.error(err.stack)
      this.fireEvent({
        message: err.message,
        name: PWPlay.playError,
      })

      await this.stop()

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
          name: PWPlay.playError,
          message: 'Playing context does not exist'
        })

      Player.isPlaying = false

      this.fireEvent({
        name: PWPlay.playEnded,
        message: 'Playing stopped',
      })

      await this.cleanUp()
    }
    catch(err){
      console.error(err.stack)

      this.fireEvent({
        name: PWPlay.playError,
        message: err.message,
      })
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

  /**
   * Helper method to clean up when recording is stopped
   * Attempts to avoid memory leaks by un setting Recorder instance properties
   */
  cleanUp = async () => {
    await this.onCleanup(this)

    this.page = undefined
    this.context = undefined
    this.browser = undefined
    delete this.page
    delete this.context
    delete this.browser
    this.options = {}
    this.onEvents = []
    Player.isPlaying = false

  }
}
