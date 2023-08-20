import type {
  TBrowser,
  TBrowserPage,
  TBrowserContext,
  TPWRecordEvent,
  TPWRecordConfig,
  TPWRecordOptions,
  TPWOnRecordEvent,
  TPWOnRecordCleanup
} from '@GBB/types'

import { constants } from './constants'
import { noOp } from '@keg-hub/jsutils/noOp'
import { EventsRecorder } from './eventsRecorder'
import { checkCall } from '@keg-hub/jsutils/checkCall'
import { deepMerge } from '@keg-hub/jsutils/deepMerge'
import { getInjectScript } from '@GBB/utils/getInjectScript'


const highlightStyles = {
  position: 'absolute',
  zIndex: '2147483640',
  background: '#f00',
  pointerEvents: 'none',
}

const RecorderInstances:Record<string, Recorder> = {}

/**
 * @type Recorder
 * @property {string} id - Id of the recorder instants
 * @property {function[]} onEvents - Callback methods called when an event is fired
 * @property {Object} page - Playwright page instance
 * @property {Object} context - Playwright context instance
 * @property {Object} browser - Playwright browser instance
 * @property {function} onCleanup - Called when the cleanup / stop methods are called
 * @property {Object} options - Custom options used while recording
 * @property {Object} options.highlightStyles - Custom styles for the highlighter
 */
export class Recorder {

  id:string = null
  browser:TBrowser
  page:TBrowserPage
  recording:boolean=false
  context:TBrowserContext
  initScriptsAdded:boolean
  initialPageLoaded:boolean=false
  onEvents:TPWOnRecordEvent[] = []
  onCleanup:TPWOnRecordCleanup = noOp as TPWOnRecordCleanup
  options:TPWRecordOptions = {
    highlightStyles,
    disableClick: true
  }

  /**
   * Helper to keep track of all Recorder instances
   * Cached created instances based on Id
   * If the instance does not exist it will be created
   * @static
   * @type {function}
   * @param {string} id - Id to use when creating the recorder instance
   * @param {Object} config - Recorder config object
   */
  static getInstance = (id:string, config:TPWRecordConfig) => {
    RecorderInstances[id] = RecorderInstances[id] || new Recorder(config, id)

    return RecorderInstances[id]
  }

  constructor(config:TPWRecordConfig, id:string) {
    this.id = id
    this.setupRecorder(config)
    this.fireEvent = this.fireEvent.bind(this)
  }

  /**
   * Loops the registered event methods and calls each one passing in the event object
   * Ensures the current recording state is added and upto date
   * @member {Recorder}
   * @type {function}
   * @param {Object} event - Data to be passed to the registered onEvent methods
   */
  fireEvent = (event:TPWRecordEvent) => {
    if(event && (event.type === constants.recordAction)) EventsRecorder?.recordEvent(event)
  
    this.onEvents.map(func => checkCall(
      func,
      {...event, isRecording: this.recording}
    ))

    return this
  }

  /**
   * Initializes the recorder
   * Ensures only the properties that are passed in are added to the Recorder 
   * @member {Recorder}
   * @type {function}
   * @param {Object} config - Recorder config object
   */
  setupRecorder = (config:TPWRecordConfig) => {
    const {
      page,
      context,
      browser,
      options,
      onEvent=noOp,
      onCleanup=noOp,
    } = config

    if(page) this.page = page
    if(context) this.context = context
    if(browser) this.browser = browser
    if(options) this.options = deepMerge(this.options, options)

    if(onEvent) this.onEvents.push(onEvent)
    if(onCleanup) this.onCleanup = onCleanup

    return this
  }


  /**
   * Adds the init scripts to the browser context
   * Scripts allow capture dom events and simulating mouse movement
   * @member {Recorder}
   * @type {function}
   */
  addInitScripts = async () => {

    if(!this.context) 
      throw new Error(`A Playwright Browser Context is required, but does not exist`)

    if(this.initScriptsAdded)
      return console.warn(`Init scripts already added to recorder context`)

    try {
      // Inject the script that detects actions and highlights elements.
      this.initScriptsAdded = true
      // Would be better to add the scripts to the context
      // But the don't seem to be initializing for each page even though they should

      // Validate if this is needed
      // await this.page.addScriptTag({content: injectedScript})

      await this.page.exposeFunction(`isGobletRecording`, this.onIsRecording)
      await this.page.exposeFunction(`getGobletRecordOption`, this.onGetOption)
      await this.context.addInitScript({
        content: getInjectScript([
          // `selector`,
          `record`,
          `mouseHelper`
        ])
      })

      // Create a binding to receive actions from the page.
      await this.page.exposeBinding('gobletRecordAction', this.onInjectedAction)

      //  Detect page loads.
      this.page.on('load', this.onPageLoad)

    }
    catch(err){
      /**
       * If the init Scripts were already added catch the error and just return
       */
      console.log(`------- addInitScript Error -------`)
      console.error(err.stack)
      // this.fireEvent({
      //   name: constants.recordError,
      //   message: err.message,
      // })
    }
    
    return this
  }

  /**
   * Starts recording dom events by injecting scripts browser context
   * @member {Recorder}
   * @type {function}
   */
  start = async ({ url, ...config }:TPWRecordConfig) => {
    try {
  
      if(this.recording){
        this.fireEvent({ name: constants.recordError, message: 'Recording already inprogress' })
        console.warn('Recording already in progress, end it first')
        return this
      }

      this.recording = true
      this.setupRecorder(config)

      if(!this.page)
        throw new Error(`A Playwright page instance is required, but does not exist.`)

      await this.addInitScripts()

      url && await this.page.goto(url)

      this.fireEvent({
        message: 'Recording started',
        name: constants.recordStarted,
      })
    }
    catch(err){
      console.error(err.stack)
      
      await this.cleanUp()

      this.fireEvent({
        name: constants.recordError,
        message: err.message,
      })
    }

    return this
  }

  /**
   * Stops recording dom events by removing the current page and creating a new one
   * @member {Recorder}
   * @type {function}
   */
  stop = async () => {
    try {
  
      if(!this.context || !this.recording)
        this.fireEvent({
          name: constants.recordError,
          message: 'Recording context does not exist'
        })

      // Turn off recording
      // Must be done before a new page is created
      // Ensure the injected scripts don't run
      this.recording = false


      // --- TODO - Probably don't want to do this any more

      this.fireEvent({
        name: constants.recordEnded,
        message: 'Recording stopped',
      })

      await this.cleanUp()
    }
    catch(err){
      console.error(err.stack)

      this.fireEvent({
        name: constants.recordError,
        message: err.message,
      })
    }

    return this
  }

  /**
   * Allows passing options to the page when needed
   * Is called from within the browser context page
   * @param {string} optName - Name of the option to get
   */
  onGetOption = (optName) => {
    return this.options[optName]
  }

  /**
   * Called when a page loads to check if dom events should be capture
   * Is called from within the browser context
   */
  onIsRecording = () => {
    return this.recording
  }

  /**
   * Called when an event was detected by the injected script on the page.
   * @param {*} - Ignored
   * @param {Object} PageEvent - Events generated by the injected record script
   */
  onInjectedAction = (_, pageEvent) => {

    if(!pageEvent)
      return console.error(`Missing pageEvent object in Recorder.onInjectedAction`)

    const hasTarget = EventsRecorder.checkTargetSelector(pageEvent, this.fireEvent)
    const noKeypress = hasTarget && EventsRecorder.checkFillSequence(pageEvent, this.fireEvent)
    const noClick = noKeypress && EventsRecorder.checkClickSequence(pageEvent, this.fireEvent)

    // If not a click event or keypress event, then manually build and fire the event
    noClick &&
      this.fireEvent({
        name: constants.recordAction,
        message: `User action ${pageEvent.type} recorded`,
        data: {
          ...pageEvent,
          codeLineLength:  1,
          ...EventsRecorder.generator.codeFromEvent(pageEvent)
        },
      })
  }

  /**
   * Called by playwright when the page finished loading (including after subsequent navigations).
   */
  onPageLoad = async (page) => {
    const title = await page.title()
    const url = await page.url()

    this.fireEvent({
      message: 'page loaded',
      // TODO: add url and other metadata to data object
      data: {
        url,
        title,
        type: constants.pageload,
        ...EventsRecorder.generator.codeFromEvent({
          url,
          type: constants.pageload,
        })
      },
      name: constants.recordAction,
    })
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
    this.recording = false
    this.options = {
      highlightStyles,
      disableClick: true
    } as TPWRecordOptions

    this.onEvents = []

    if(this.id) delete RecorderInstances[this.id]
  }
}
