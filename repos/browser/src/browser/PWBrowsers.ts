import type {
  TBrowser,
  TPWBrowser,
  EBrowserType,
  EBrowserName,
  TBrowserConf,
  TPWComponents,
  TBrowserContext,
} from '@gobletqa/shared/types'
import type {
  TGetPageCB,
  TGetBrowser,
  TStartBrowser,
  TPWBrowsersOpts,
  TCreateBrowserOpts,
} from '@GBB/types'

import playwright from 'playwright'
import { logEnvMsg } from '@GBB/utils/logger'
import { toBool } from '@keg-hub/jsutils/toBool'
import { CreateBrowserRetry } from '@GBB/constants'
import { emptyObj } from '@keg-hub/jsutils/emptyObj'
import { buildStatus } from '@GBB/utils/buildStatus'
import { socketActive } from '@GBB/utils/checkVncEnv'
import { deepMerge } from '@keg-hub/jsutils/deepMerge'
import { inDocker } from '@keg-hub/jsutils/node/inDocker'
import { getBrowserOpts } from '@GBB/utils/getBrowserOpts'
import { getBrowserType } from '@GBB/utils/getBrowserType'
import { getContextOpts } from '@GBB/utils/getContextOpts'
import { buildBrowserConf } from '@GBB/utils/buildBrowserConf'
import { getServerEndpoint } from '@GBB/server/getServerEndpoint'
import {
  EmptyBrowser,
  checkInternalPWContext
} from '@GBB/utils/checkInternalPWContext'

const buildStartOpts = (args:TStartBrowser) => {
  const {
    world,
    config,
    overrides,
    initialUrl,
    _loopedType,
    _isLoopedCalled,
  } = args

  const browserConf = _isLoopedCalled ? args.browserConf : buildBrowserConf(args)
  const type = _loopedType || getBrowserType(browserConf.type as EBrowserType)

  return {
    type,
    world,
    config,
    overrides,
    initialUrl,
    browserConf,
    internalPW: checkInternalPWContext(type)
  }
}

export class PWBrowsers {
  
  #creatingBrowser:boolean=false
  #startingBrowser:boolean=false
  
  #browsers:Record<EBrowserName, TBrowser>
  
  constructor(opts?:TPWBrowsersOpts){
    this.#browsers = opts?.browsers || {} as Record<EBrowserName, TBrowser>
  }

  /**
  * Checks if the Browser should be created from a Websocket and the running browser server
  */
  #fromWebsocket = (
    browserConf:TBrowserConf = emptyObj as TBrowserConf,
    browserServer?:boolean
  ):boolean => {
    return !toBool(process.env.GOBLET_RUN_FROM_CI)
      && (
        browserServer
          || browserConf?.ws
          || socketActive()
      )
  }

  /**
  * Starts new browser by connecting to an existing browser server websocket
  * @function
  */
  #createWSBrowser = async (type:EBrowserName):Promise<TPWBrowser> => {
    const endpoint = await getServerEndpoint(type)

    // Check if the websocket is active
    // If so, then update the endpoint url to target the host machine
    const browserEndpoint =
      inDocker() && socketActive()
        ? endpoint.replace('127.0.0.1', 'host.docker.internal')
        : endpoint

    const browser = await playwright[type].connect(browserEndpoint)
    logEnvMsg(`createWSBrowser - Browser ${type} was started from server websocket ${browserEndpoint}`)

    this.#setBrowser(browser, { type })

    return { browser } as TPWBrowser
  }



  /**
  * Creates a browser and context together
  * The context is always the same, and saves data
  */
  #createPersistentBrowser = async (args:TCreateBrowserOpts) => {
    const {
      type,
      world,
      config,
      browserConf= emptyObj as TBrowserConf
    } = args


    const opts = deepMerge(
      getBrowserOpts(browserConf, config, world),
      getContextOpts({config, contextOpts: browserConf.context, world})
    )
    logEnvMsg(`Browser-PersistentContext options`, `verbose`, opts)
    
    const context = await playwright[type].launchPersistentContext(opts)

    const browser = new EmptyBrowser(context, type) as unknown as TBrowser
    logEnvMsg(`createPersistentBrowser - Browser ${type} was started`)
    this.#setBrowser(browser, browserConf)

    return { browser, context } as TPWBrowser
  }

  /**
  * Sets the cached playwright server
  */
  #setBrowser = (
    browser:TBrowser,
    browserConf:TBrowserConf,
  ) => {

    if(!browser){
      logEnvMsg(`Attempted to set non-existing browser in private #setBrowsers method.`, `warn`)

      return this.#browsers
    }

    browser.__browserGoblet = {...browser?.__browserGoblet, ...browserConf}

    const bType = browser.browserType().name()

    // Set the new browser
    this.#browsers[bType] = browser

    // @ts-ignore
    // Add listener to delete the browser when closed
    !browser.__GobletHasDisconnectedEvt
      && browser?.on?.(`disconnected`, async () => {
        browser.__browserGoblet = undefined
        delete browser.__browserGoblet
        // @ts-ignore
        browser.__GoblethasDisconnectedEvt = undefined

        if(global.browser === browser) global.browser = undefined

        if (!this.#browsers[bType]) return

        this.#browsers[bType] = undefined
        delete this.#browsers[bType]
      })

    // @ts-ignore
    browser.__GobletHasDisconnectedEvt = true

    return this.#browsers
  }

  /**
  * Creates a regular browser NOT connected to a browser server over websocket
  * Should only really be run in CI environments
  * All other cases should use the browser-server websocket
  */
  #createBrowser = async (args:TCreateBrowserOpts) => {
    const {
      type,
      world,
      config,
      browserConf=emptyObj as TBrowserConf,
    } = args

    const opts = getBrowserOpts(browserConf, config, world)

    const browser = await playwright[type].launch(opts)

    logEnvMsg(`createBrowser - Browser ${type} was started`, `verbose`, opts)
    this.#setBrowser(browser, { ...browserConf, ...opts })

    return { browser } as TPWBrowser
  }

  /**
  * Closes a browser, and removes it from the this.#browsers object
  */
  closeBrowser = async (type?:EBrowserType) => {
    const browserType = getBrowserType(type)
    const browser = this.#browsers[browserType]

    try {
      browser && await browser?.close()
    }
    catch (err) {
      logEnvMsg(err.stack, `warn`)
    }
    finally {
      this.#browsers[browserType] = undefined
      delete this.#browsers[browserType]
    }

    return this.#browsers
  }


  fromCache = (type?:EBrowserType|EBrowserName) => this.#browsers[getBrowserType(type)]

  /**
  * Gets an existing browser, or starts a new one using the Playwright API
  * @function
  */
  getBrowser = async (args:TGetBrowser):Promise<TPWBrowser> => {
    
    const {
      world,
      config,
      browserConf= emptyObj as TBrowserConf,
    } = args
    
    try {

      const type = getBrowserType(browserConf.type)
      const pwBrowser = this.fromCache(type)

      if (pwBrowser) {
        logEnvMsg(`getBrowser - Using existing browser ${type}`)
        return { browser: pwBrowser } as TPWBrowser
      }

        // Because of multiple calls from the frontend on startup
        // If more then one calls, and the browser is not yet created
        // Then potentially two browsers will be created
        // So this re-calls the same method when this.#creatingBrowser is set
      if(this.#creatingBrowser)
        return new Promise((res, rej) => {
          logEnvMsg(`getBrowser - Browser ${type} is creating, try agin in ${CreateBrowserRetry}ms`)
          setTimeout(() => res(this.getBrowser(args)), CreateBrowserRetry)
        })

      this.#creatingBrowser = true
      

      /** ------------------------------------

      * TODO: - At some point will need to rework this to figure out the best option
      * Need to setup params to toggle the browser type
      * Will need to enable the browser server running via supervisor

        // If the websocket is active, then start a websocket browser
        const fromWs = fromWebsocket(browserConf, browserServer)
        const browserResp = fromWs
          ? await createWSBrowser(type)
          : await createBrowser(browserConf, type)
        fromWs
          ? logEnvMsg(`getBrowser - New Websocket Browser ${type} created`)
          : logEnvMsg(`getBrowser - New Standalone Browser ${type} created`)

      
        await createWSBrowser(type)
        logEnvMsg(`getBrowser - New Websocket Browser ${type} created`)

        const browserResp = await this.#createPersistentBrowser({
          type,
          browserConf,
        })
        logEnvMsg(`getBrowser - New Persistent Context Browser ${type} created`)

      ------------------------------------ */


      // Default to creating a standalone browser
      // Should be faster then going over a websocket
      const browserResp = await this.#createBrowser({
        type,
        world,
        config,
        browserConf,
      })
      logEnvMsg(`getBrowser - New Standalone Browser ${type} created`)

      this.#creatingBrowser = false
      return browserResp

    }
    catch(err){
      // Ensure creatingBrowser gets set to false
      this.#creatingBrowser = false
      throw err
    }
  }

  /**
  * Starts browser using playwright
  * See https://playwright.dev/docs/api/class-browsertype#browser-type-launch|Playwright Docs for more info
  * @function
  * @public
  */
  startBrowser = async (
    args:TStartBrowser,
    getPage:TGetPageCB
  ):Promise<TPWComponents> => {

    try {

      const {
        type,
        world,
        config,
        overrides,
        initialUrl,
        internalPW,
        browserConf
      } = buildStartOpts(args)

      let pwComponents = internalPW
      if(pwComponents?.browser)
        this.#setBrowser(
          pwComponents.browser,
          browserConf
        )

      if(!pwComponents?.page){
        logEnvMsg(`startBrowser - Getting browser type ${type}`)

        const pwBrowser = pwBrowsers.fromCache(type)

        // Because of multiple calls from the frontend on startup
        // If more then one calls, and the browser is not yet created
        // Then potentially two browsers will be created
        // So this re-calls the same method when this.#startingBrowser is set
        if(!pwBrowser && this.#startingBrowser)
          return new Promise((res, rej) => {

            logEnvMsg(`startBrowser - Browser ${type} is creating, try agin in ${CreateBrowserRetry}ms`)

            setTimeout(() => res(
              this.startBrowser({
                ...args,
                config,
                browserConf,
                _loopedType: type,
                _isLoopedCalled: true
              }, getPage)
            ), CreateBrowserRetry)

          })


        this.#startingBrowser = true
        pwComponents = await getPage({
          world,
          config,
          overrides,
          initialUrl,
          browserConf
        })
        this.#startingBrowser = false

        logEnvMsg(`startBrowser - Browser ${type} and child components found`)
      }

      const hasComponents = Boolean(
        pwComponents.browser
          && pwComponents.context
          && pwComponents.page
      )

      return {
        ...pwComponents,
        status: buildStatus(browserConf.type, hasComponents),
      } as TPWComponents
    }
    catch(err){
      getPage.creatingPage = false
      this.#startingBrowser = false
      throw err
    }

  }

  /**
  * Captures new pages being opened, so they can be handled accordingly
  * @function
  * @public
  */
  captureNewPages = async (context:TBrowserContext) => {
    // Get all new pages (including popups) in the context
    // context.on('page', async page => {
    //   await page.waitForLoadState()
    //   const url = page.url()
    //   // Handle new pages trying to redirect to new urls
      
    // })
  }


}

export const pwBrowsers = new PWBrowsers()
