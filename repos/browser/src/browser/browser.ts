import type { TStartBrowser } from './PWBrowsers'
import type {
  TBrowser,
  TBrowserPage,
  TBrowserConf,
  EBrowserType,
  TGobletConfig,
  TPWComponents,
  TBrowserContext,
} from '@GBB/types'

import { Automate } from '../automate'
import { pwBrowsers } from './PWBrowsers'
import { ghostMouse } from './ghostMouse'
import { Logger } from '@GBB/utils/logger'
import { emptyObj } from '@keg-hub/jsutils'
import { ENVS } from '@gobletqa/environment'
import { getBrowserType } from '@GBB/utils/getBrowserType'
import { getContextOpts } from '@GBB/utils/getContextOpts'
import { buildBrowserConf } from '@GBB/utils/buildBrowserConf'
import { GobletQAUrl, CreateBrowserRetry } from '@GBB/constants'
import { checkInternalPWContext } from './checkInternalPWContext'

export type TGetPWComponents = {
  initialUrl?:string
  config?:TGobletConfig
  browserConf?:TBrowserConf,
}

export type TBrowserOnly = {
  config?:TGobletConfig
  browserServer?:boolean
  browserConf?:TBrowserConf
}

export type TGetPage = TGetPWComponents & {
  overrides?:Partial<TBrowserConf>
}
export type TGetPageCB = ((props:TGetPage) => Promise<TPWComponents>) & {
  creatingPage:boolean
}

export type TGetCtx = {
  config?:TGobletConfig
  browserConf:TBrowserConf
  overrides?:Partial<TBrowserConf>
}

export class Browser {

  browser:TBrowser
  page:TBrowserPage
  context:TBrowserContext
  creatingPage:boolean=false
  close=pwBrowsers.closeBrowser

  constructor(){
    
  }

  #getPage = async ({
    config,
    browserConf,
    initialUrl=GobletQAUrl,
    overrides=emptyObj as TBrowserConf,
  }:TGetPage):Promise<TPWComponents> => {

    try {

      const { context, browser } = await this.#getContext({
        config,
        overrides,
        browserConf,
      })
      const pages = context.pages()
      
      !ENVS.GOBLET_RUN_FROM_CI && Logger.verbose(`getPage - Found ${pages.length} pages open on the context`)
      
      const hasPages = Boolean(pages.length)
      const hasMultiplePages = pages.length > 1

      if(hasMultiplePages){
        Logger.verbose(`getPage - Closing extra pages on the context`)
        await Promise.all(pages.map(async (page, idx) => idx && await page.close()))
      }

      // Hack due to multiple calls on frontend startup
      // If more then one calls, and the browser is not create
      // then it will create two browsers
      // So this re-calls the same method when creatingBrowser is set
      // To allow consecutive calls on start up
      if(!hasPages && this.creatingPage)
        return new Promise((res, rej) => {
          Logger.info(`getPage - Browser Page is creating, try agin in ${CreateBrowserRetry}ms`)
          setTimeout(() => res(this.#getPage({
            initialUrl,
            browserConf
          })), CreateBrowserRetry)
        })

      let page:TBrowserPage
      this.creatingPage = true
      if(hasPages) page = pages[0]
      else {

        const pg = await context.newPage()
        
        const page = ghostMouse(pg)

        try {
          await page.goto(initialUrl)
        }
        catch(err){
          console.error(err)
        }
      }

      this.creatingPage = false
      const browserType = browser.browserType?.().name?.()

      if(!ENVS.GOBLET_RUN_FROM_CI){
        hasPages
          ? Logger.verbose(`getPage - Found page on context for browser ${browserType}`)
          : Logger.verbose(`getPage - New page created on context for browser ${browserType}`)
      }


      return { context, browser, page } as TPWComponents
    }
    catch(err){
      this.creatingPage = false
      throw err
    }

  }

  #getContext = async (args:TGetCtx) => {
    const {
      config,
      browserConf,
      overrides=emptyObj as TBrowserConf,
    } = args


    const resp = await pwBrowsers.getBrowser({ config, browserConf })

    let context = resp.context
    const browser = resp.browser
    
    if(!context){
      const contexts = browser.contexts()
      const hasContexts = Boolean(contexts.length)
      const hasMultipleContexts = contexts.length > 1

      if(hasMultipleContexts){
        !ENVS.GOBLET_RUN_FROM_CI && Logger.verbose(`getContext - Closing extra contexts on the browser`)
        await Promise.all(contexts.map(async (context, idx) => idx && await context.close()))
      }

      const options = getContextOpts({
        config,
        overrides: overrides.context,
        contextOpts: browserConf.context,
      })
      
      !ENVS.GOBLET_RUN_FROM_CI && Logger.verbose(`Context Options`, options)

      if(hasContexts){
        context = contexts[0]
        !ENVS.GOBLET_RUN_FROM_CI && Logger.verbose(`getContext - Found existing context on browser ${browserConf.type}`)
      }
      else {
        context = await browser.newContext(options) as TBrowserContext
        context.__goblet = { options }

        !ENVS.GOBLET_RUN_FROM_CI && Logger.verbose(`getContext - New context created for browser ${browserConf.type}`)

        Automate.bind({ parent: context })
      }

    }
    else {
      !ENVS.GOBLET_RUN_FROM_CI && Logger.verbose(`getContext - Found Persistent context for browser ${browserConf.type}`)
    }

    return { context, browser }
  }

  #getBrowser = async (args:TBrowserOnly) => {
    const { config, browserServer } = args

    const resp = await pwBrowsers.getBrowser({
      config,
      opts: { browserServer },
      browserConf: buildBrowserConf(args),
    })

    return resp as TPWComponents
  }

  server = async (args:TBrowserOnly) => this.#getBrowser(args)

  start = async (props:TStartBrowser):Promise<TPWComponents> => {
    return await pwBrowsers.startBrowser(props, this.#getPage as TGetPageCB)
  }

  get = async (args:TGetPWComponents) => {
    const {
      config,
      initialUrl=GobletQAUrl,
      browserConf=emptyObj as TBrowserConf,
    } = args

    const pwComponents = checkInternalPWContext(getBrowserType(browserConf.type as EBrowserType))

    return pwComponents?.page
      ? pwComponents
      : await this.#getPage({
          config,
          initialUrl,
          browserConf,
        })
  }

  screenshot = async (args:Record<string, any>) => {
    // await page.screenshot({ path: 'screenshot.png', fullPage: true });
  }

}

export const GBrowser = new Browser()