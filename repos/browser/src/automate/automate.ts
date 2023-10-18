import type {
  TBrowserPage,
  TPWComponents,
  TBrowserContext,
  TAutomateOpts,
  TAutomateEvent,
  TAutomateConfig,
  TAutomateParent,
  TOnAutomateEvent,
  TUserAutomateOpts,
  TAutomateCleanupCB,
  TAutomatePageEvent,
  TAutomateElementEvent,
} from '@GBB/types'


import { ENVS } from '@gobletqa/environment'
import { noOp } from '@keg-hub/jsutils/noOp'
import { logEnvMsg } from '@GBB/utils/logger'
import { PWAutomateEvent } from '@GBB/constants'
import { checkCall } from '@keg-hub/jsutils/checkCall'
import { deepMerge } from '@keg-hub/jsutils/deepMerge'
import { addPWInitScripts } from '@GBB/utils/addPWInitScripts'
import { exposePWFunction } from '@GBB/utils/exposePWFunction'


export class Automate {

  /**
   * Creates a new instance of automate and binds it to a playwright context or page
   */
  static bind = async (config?:TAutomateConfig, id?:string) => {
    logEnvMsg(`Automate - Bind playwright parent to automate instance`)

    const automate = new Automate(config, id || config?.parent?._guid)
    Automate.addPlaywright(automate.parent, automate)
    await Automate.addInitScripts(automate.parent, automate)
  }

  /**
   * Ties an automate instance class to the browser context or parent
   * When the parent closes the automate class is removed as well
   * Sets a single automate instance per parent
   */
  static addPlaywright = (parent:TAutomateParent, instance:Automate) => {
    logEnvMsg(`Automate - Adding automate instance to playwright`)

    if(parent.__GobletAutomateInstance){
      logEnvMsg(`Automate - An automate instance already exist on playwright parent`, `warn`)
      return
    }

    parent.__GobletAutomateInstance = instance

    // Add on parent close listener to cleanup the automate instance
    // @ts-ignore
    parent.on(`close`, async (parent:TAutomateParent) => {
      const automate = parent.__GobletAutomateInstance
      await automate?.cleanUp?.()
      parent.__GobletAutomateInstance = undefined
    })
  }

  /**
   * Adds the init scripts to the browser context
   */
  static addInitScripts = async (parent:TAutomateParent, automate?:Automate) => {
    logEnvMsg(`Automate - Adding automate init scripts to playwright parent`)
    
    automate = automate || parent.__GobletAutomateInstance
    if(!automate)
      throw new Error(`Could not find goblet automate instance on parent object`)

    // Don't add the UI scripts in CI environment
    if(ENVS.GOBLET_RUN_FROM_CI || ENVS.GOBLET_RUN_FROM_UI) return

    await exposePWFunction(
      parent,
      `getGobletHoverOption`,
      automate.getHoverOption
    )
    await exposePWFunction(
      parent,
      `onGobletSelectAction`,
      automate.gobletSelectAction
    )
    await addPWInitScripts(
      parent,
      [`selector`, `mouseHover`]
    )
  }

  static turnOnElementSelect = async (
    pwComponents:Partial<TPWComponents>,
    options?:TUserAutomateOpts
  ) => {
    logEnvMsg(`Automate - Turning on browser element select`)

    const parent = Automate.getParent(pwComponents)
    const automate = parent.__GobletAutomateInstance

    if(!automate)
      throw new Error(`Could not find goblet automate instance on parent object`)

    const page = Automate.getPage(automate)
    await automate?.selectPageElementOn?.(page, options)

    return automate
  }

  static turnOffElementSelect = async (pwComponents:Partial<TPWComponents>) => {
    logEnvMsg(`Automate - Turning off browser element select`)

    const parent = Automate.getParent(pwComponents)
    const automate = parent.__GobletAutomateInstance

    if(!automate)
      throw new Error(`Could not find goblet automate instance on parent object`)

    const page = Automate.getPage(automate)
    await automate?.selectPageElementOff?.(page)

    return automate
  }

  static getPageUrl = async (
    pwComponents:Partial<TPWComponents>,
    options?:TUserAutomateOpts
  ) => {
    logEnvMsg(`Automate - Getting active page URL`)

    const parent = Automate.getParent(pwComponents)
    const automate = parent.__GobletAutomateInstance
    if(!automate)
      throw new Error(`Could not find goblet automate instance on parent object`)

    const page = Automate.getPage(automate)
    await automate?.pageUrl?.(page)
  }

  static addEventListener = (
    pwComponents:Partial<TPWComponents>,
    onEvent:TOnAutomateEvent
  ) => {
    const parent = Automate.getParent(pwComponents)
    const automate = parent.__GobletAutomateInstance
    automate.registerListener(onEvent)
  }

  /**
   * Turns off element select in the browser
   * Will most likely do other things to once recording it worked on
   */
  static cancel = async (pwComponents:Partial<TPWComponents>, data:any) => {
    logEnvMsg(`Automate - Canceling automation`)
    await Automate.turnOffElementSelect(pwComponents)

  }

  /**
   * Gets a browser page from the parent
   * Checks for evaluate method to know if parent is a page or context
   */
  static getPage = (automate:Automate):TBrowserPage => {
    logEnvMsg(`Automate - Getting playwright page for automate instance`)
 
    const page = automate.parent as TBrowserPage
    const context = automate.parent as TBrowserContext
    return typeof page.evaluate === `function` ? page : context.pages()[0]
  }

  /**
   * Gets the playwright component that has the instance of automate on it
   */
  static getParent = (pwComponents:Partial<TPWComponents>) => {
    const context = pwComponents.context as TAutomateParent
    if(context.__GobletAutomateInstance) return context

    const page = pwComponents.page as TAutomateParent
    if(page.__GobletAutomateInstance) return page
  }

  id?:string = null
  parent: TAutomateParent
  onEvents:TOnAutomateEvent[] = []
  onCleanup:TAutomateCleanupCB = noOp
  options:TAutomateOpts = {
    highlightStyles: {
      borderRadius: `5px`,
      position: `absolute`,
      zIndex: `2147483640`,
      pointerEvents: `none`,
      border: `5px solid #c491ff`,
      transition: `left 100ms ease 0s, top 100ms ease 0s, height 100ms ease 0s, width 100ms ease 0s`
    }
  } as TAutomateOpts

  constructor(config?:TAutomateConfig, id?:string){
    this.id = id
    config && this.init(config)
  }

  /**
   * Loops the registered event methods and calls each one passing in the event object
   * Ensures the current recording state is added and upto date
   */
  fireEvent = <T=TAutomateElementEvent>(event:TAutomateEvent<T>) => {
    logEnvMsg(`Automate - Fire automate event`, `debug`, event)
    
    this.onEvents.map(func => checkCall(func, event))
    return this
  }

  init = async (config:TAutomateConfig) => {
    logEnvMsg(`Automate - Initializing automate instance`)

    const {
      parent,
      options,
      onEvent,
      onCleanup,
    } = config

    if(parent) this.parent = parent as TAutomateParent
    if(options) this.options = deepMerge(this.options, options)

    if(onEvent) this.onEvents.push(onEvent)
    if(onCleanup) this.onCleanup = onCleanup

    return this
  }

  /**
   * Adds event callback, called when events are fired
   */
  registerListener = (onEvent:TOnAutomateEvent) => {
    !this.onEvents.includes(onEvent) && this.onEvents.push(onEvent)
  }

  getHoverOption = (option:string) => {
    logEnvMsg(`Automate - Getting automate option ${option}`)
    
    const found = option ? this.options[option] : undefined
    return found
  }

  gobletSelectAction = async (data:TAutomateElementEvent) => {
    logEnvMsg(`Automate - Firing automate select-element event`)

    await this.selectPageElementOff()
    this.fireEvent({
      data,
      name: PWAutomateEvent,
    })
  }

  selectPageElementOff = async (page?:TBrowserPage) => {
    page = page || Automate.getPage(this)

    // @ts-ignore
    await page.evaluate(() => window.__gobletElementSelectOff())
  }

  selectPageElementOn = async (
    page?:TBrowserPage,
    options?:TUserAutomateOpts
  ) => {
    page = page || Automate.getPage(this)

    await page.evaluate((options) => (
    // @ts-ignore
      window.__gobletElementSelectOn(options)
    ), options)
  }
  
  pageUrl = async (
    page?:TBrowserPage,
    options?:TUserAutomateOpts
  ) => {
    page = page || Automate.getPage(this)
    const url = page.url()

    this.fireEvent<TAutomatePageEvent>({
      data: { url },
      name: PWAutomateEvent,
    })
  }

  /**
   * Helper method to clean up when recording is stopped
   * Attempts to avoid memory leaks by un setting Recorder instance properties
   */
  cleanUp = async () => {
    logEnvMsg(`Automate - Cleaning up automate instance`)
    
    await this.onCleanup(this)

    if(this.parent) {
      this.parent.__GobletAutomateInstance = undefined
      delete this.parent.__GobletAutomateInstance
    }

    this.parent = undefined
    delete this.parent

    this.onEvents = []
    this.options = {} as TAutomateOpts
  }

}
