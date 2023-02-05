import type {
  TAutomateOpts,
  TAutomateEvent,
  TAutomateConfig,
  TOnAutomateEvent,
  TAutomateCleanupCB,

  TBrowser,
  TBrowserPage,
  TBrowserContext,
} from '@GSC/types'

import {
  PWAutomateHoverOn,
  PWAutomateHoverOff,
} from '@GSC/constants'

import {noOp, checkCall, deepMerge} from '@keg-hub/jsutils'
import { getInjectScript } from '../helpers/getInjectScript'

const globalActions = {
  toggleHove: `__gobletToggleHoveActive`,
  removeListener: `__gobletRemoveHoverListen`,
}


/**
 * Ties an automate instance class to the browser page
 * When the page closes the automate class is removed as well
 * Sets a single automate instance per page
 */
const addAutomateToPage = (instance:Automate, page:TBrowserPage) => {
  // @ts-ignore
  if(page.__GobletAutomateInstance) return

  // @ts-ignore
  page.__GobletAutomateInstance = instance

  // Add on page close listener to cleanup the automate instance
  page.on(`close`, async (page) => {
    // @ts-ignore
    const automate = page.__GobletAutomateInstance as Automate
    await automate?.cleanUp()
  })
}

export class Automate {

  id?:string = null
  browser:TBrowser
  page:TBrowserPage
  context:TBrowserContext
  initialized:boolean=false
  onEvents:TOnAutomateEvent[] = []
  onCleanup:TAutomateCleanupCB = noOp
  options:TAutomateOpts = {
    highlightStyles: {
      borderRadius: `5px`,
      position: `absolute`,
      zIndex: `2147483640`,
      pointerEvents: `none`,
      border: `3px solid #785B9C`,
      transition: `left 100ms ease 0s, top 100ms ease 0s, height 100ms ease 0s, width 100ms ease 0s`
    }
  } as TAutomateOpts

  constructor(config:TAutomateConfig, id?:string){
    this.id = id
    this.init(config)
  }

  /**
   * Loops the registered event methods and calls each one passing in the event object
   * Ensures the current recording state is added and upto date
   * @member {Recorder}
   */
  fireEvent = (event:TAutomateEvent) => {
    this.onEvents.map(func => checkCall(func, event))

    return this
  }

  init = async (config:TAutomateConfig) => {
    if(this.initialized) return this

    this.initialized = true

    const {
      page,
      context,
      browser,
      options,
      onEvent,
      onCleanup,
    } = config

    if(page){
      this.page = page
      addAutomateToPage(this, this.page)
    }

    if(context) this.context = context
    if(browser) this.browser = browser
    if(options) this.options = deepMerge(this.options, options)

    if(onEvent) this.onEvents.push(onEvent)
    if(onCleanup) this.onCleanup = onCleanup

    await this.addInitScripts()

    return this

  }

  /**
   * Adds event callback, called when events are fired
   * @member {Recorder}
   * @type {function}
   */
  registerListener = (onEvent:TOnAutomateEvent) => {
    this.onEvents.push(onEvent)
  }

  /**
   * Adds the init scripts to the browser context
   * @member {Recorder}
   * @type {function}
   */
  addInitScripts = async () => {
    if(!this.initialized)
      throw new Error(`Automate#init must be called before addInitScripts can be called`)

    try {
      await this.page.exposeFunction(`getGobletHoverOption`, this.getHoverOption)
      
      await this.page.addInitScript({
        content: getInjectScript([`mouseHover`])
      })
    }
    catch(err){}
  }
  
  getHoverOption = (option:string) => {
    console.log(`------- GET HOVER OPTIONS -------`)
    console.log(`------- option -------`)
    console.log(option)
    
    const found = option ? this.options[option] : undefined
    
    return found
  }
  
  toggleHoverActive = async () => {
    if(!this.initialized)
      throw new Error(`Automate#init must be called before toggleHoverActive can be called`)
    
    await this.page.evaluate(() => {
      // @ts-ignore
      window.__gobletToggleHoveActive()
    })
  }

  /**
   * Helper method to clean up when recording is stopped
   * Attempts to avoid memory leaks by un setting Recorder instance properties
   */
  cleanUp = async () => {
    await this.onCleanup(this)

    // @ts-ignore
    if(this.page) this.page.__GobletAutomateInstance = undefined
    this.page = undefined
    this.context = undefined
    this.browser = undefined
    delete this.page
    delete this.context
    delete this.browser
    this.onEvents = []
    this.options = {} as TAutomateOpts
    this.initialized = false

  }

}