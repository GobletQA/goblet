import type {
  TBrowser,
  TPWBrowser,
  TBrowserConf,
  EBrowserType,
  EBrowserName,
  TPWComponents,
} from '@GSC/types'
import type { TGetPageCB } from './browser'

import playwright from 'playwright'
import { Logger } from '@GSC/utils/logger'
import { deepMerge } from '@keg-hub/jsutils'
import { EmptyBrowser } from './emptyBrowser'
import { CreateBrowserRetry } from '@GSC/constants'
import { buildStatus } from '../helpers/buildStatus'
import { checkVncEnv } from '../../utils/vncActiveEnv'
import { toBool, emptyObj, isFunc } from '@keg-hub/jsutils'
import { getBrowserOpts } from '../helpers/getBrowserOpts'
import { getBrowserType } from '../helpers/getBrowserType'
import { getContextOpts } from '../helpers/getContextOpts'
import { inDocker } from '@keg-hub/jsutils/src/node/inDocker'
import { buildBrowserConf } from '../helpers/buildBrowserConf'
import { getServerEndpoint } from '../server/getServerEndpoint'
import { checkInternalPWContext } from './checkInternalPWContext'
import { getDefaultGobletConfig } from '@gobletqa/shared/goblet/getDefaultGobletConfig'

type TGetBrowserOpts = {
  browserServer?:boolean,
}

export type TStartBrowser = {
  initialUrl?:string
  browserServer?:boolean,
  _isLoopedCalled?:boolean
  _loopedType?:EBrowserName
  browserConf?:TBrowserConf
  overrides?:Partial<TBrowserConf>
}

export type TBrowserOnly = {
  browserServer?:boolean
  browserConf?:TBrowserConf
}


export type TPWBrowsersOpts = {
  browsers:Record<EBrowserName, TBrowser>
}


const buildStartOpts = (props:TStartBrowser) => {
  const {
    overrides,
    initialUrl,
    _loopedType,
    _isLoopedCalled,
    browserConf:config,
  } = props

  const browserConf = _isLoopedCalled ? config : buildBrowserConf(config)
  const type = _loopedType || getBrowserType(browserConf.type as EBrowserType)

  return {
    type,
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
    const { isKube, socketActive } = checkVncEnv()

    return !toBool(process.env.GOBLET_RUN_FROM_CI)
      && (
        browserServer
          || browserConf?.ws
          || socketActive
          || isKube
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
      inDocker() && checkVncEnv().socketActive
        ? endpoint.replace('127.0.0.1', 'host.docker.internal')
        : endpoint

    const browser = await playwright[type].connect(browserEndpoint)
    Logger.info(`createWSBrowser - Browser ${type} was started from server websocket ${browserEndpoint}`)

    this.#setBrowser(browser, { type })

    return { browser } as TPWBrowser
  }

  /**
  * Creates a browser and context together
  * The context is always the same, and saves data
  */
  #createPersistentBrowser = async (
    browserConf:TBrowserConf = emptyObj as TBrowserConf,
    type:EBrowserName
  ) => {

    const opts = deepMerge(
      getBrowserOpts(browserConf),
      getContextOpts(browserConf.context)
    )
    Logger.verbose(`Browser-PersistentContext options`, opts)
    
    const { internalPaths } = getDefaultGobletConfig()
    const context = await playwright[type].launchPersistentContext(
      internalPaths.userDataTempDir,
      opts
    )

    const browser = new EmptyBrowser(context, type)
    Logger.info(`createPersistentBrowser - Browser ${type} was started`)
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
      Logger.warn(`Attempted to set non-existing browser in private #setBrowsers method.`)
      return this.#browsers
    }

    browser.__goblet = {...browser?.__goblet, ...browserConf}

    const bType = browser.browserType().name()

    // Set the new browser
    this.#browsers[bType] = browser

    // Add listener to delete the browser when closed
    isFunc(browser.on) &&
      browser.on(`disconnected`, async () => {
        if (!this.#browsers[bType]) return

        this.#browsers[bType] = undefined
        delete this.#browsers[bType]
      })

    return this.#browsers
  }

  /**
  * Creates a regular browser NOT connected to a browser server over websocket
  * Should only really be run in CI environments
  * All other cases should use the browser-server websocket
  */
  #createBrowser = async (
    browserConf:TBrowserConf = emptyObj as TBrowserConf,
    type:EBrowserName
  ) => {

    const opts = getBrowserOpts(browserConf)
    const browser = await playwright[type].launch(opts)

    Logger.info(`createBrowser - Browser ${type} was started`)
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
      Logger.warn(err.stack)
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
  getBrowser = async (
    browserConf:TBrowserConf = emptyObj as TBrowserConf,
    opts:TGetBrowserOpts=emptyObj
  ):Promise<TPWBrowser> => {
    try {

      const type = getBrowserType(browserConf.type)
      const pwBrowser = this.fromCache(type)

      if (pwBrowser) {
        Logger.verbose(`getBrowser - Using existing browser ${type}`)
        return { browser: pwBrowser } as TPWBrowser
      }

        // Because of multiple calls from the frontend on startup
        // If more then one calls, and the browser is not yet created
        // Then potentially two browsers will be created
        // So this re-calls the same method when this.#creatingBrowser is set
      if(this.#creatingBrowser)
        return new Promise((res, rej) => {
          Logger.verbose(`getBrowser - Browser ${type} is creating, try agin in ${CreateBrowserRetry}ms`)
          setTimeout(() => res(this.getBrowser(browserConf, opts)), CreateBrowserRetry)
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
          ? Logger.verbose(`getBrowser - New Websocket Browser ${type} created`)
          : Logger.verbose(`getBrowser - New Standalone Browser ${type} created`)

      
        await createWSBrowser(type)
        Logger.verbose(`getBrowser - New Websocket Browser ${type} created`)

        const browserResp = await createPersistentBrowser(browserConf, type)
        Logger.verbose(`getBrowser - New Persistent Context Browser ${type} created`)

      ------------------------------------ */


      // Default to creating a standalone browser
      // Should be faster then going over a websocket
      const browserResp = await this.#createBrowser(browserConf, type)
      Logger.verbose(`getBrowser - New Standalone Browser ${type} created`)

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
    props:TStartBrowser,
    getPage:TGetPageCB
  ):Promise<TPWComponents> => {

    try {

      const {
        type,
        overrides,
        initialUrl,
        internalPW,
        browserConf
      } = buildStartOpts(props)

      let pwComponents = internalPW
      if(pwComponents?.browser)
        this.#setBrowser(
          pwComponents.browser,
          browserConf
        )

      if(!pwComponents?.page){
        Logger.info(`startBrowser - Getting browser type ${type}`)

        const pwBrowser = pwBrowsers.fromCache(type)

        // Because of multiple calls from the frontend on startup
        // If more then one calls, and the browser is not yet created
        // Then potentially two browsers will be created
        // So this re-calls the same method when this.#startingBrowser is set
        if(!pwBrowser && this.#startingBrowser)
          return new Promise((res, rej) => {

            Logger.info(
              `startBrowser - Browser ${type} is creating, try agin in ${CreateBrowserRetry}ms`
            )

            setTimeout(() => res(
              this.startBrowser({
                ...props,
                browserConf,
                _loopedType: type,
                _isLoopedCalled: true
              }, getPage)
            ), CreateBrowserRetry)

          })


        this.#startingBrowser = true
        pwComponents = await getPage({
          overrides,
          initialUrl,
          browserConf
        })
        this.#startingBrowser = false

        Logger.info(`startBrowser - Browser ${type} and child components found`)
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


}

export const pwBrowsers = new PWBrowsers()