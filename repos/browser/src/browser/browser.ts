import type {
  TBrowser,
  TGetCtx,
  TGetPage,
  TGetPageCB,
  TBrowserPage,
  TBrowserConf,
  EBrowserType,
  TBrowserOnly,
  TPWComponents,
  TStartBrowser,
  TBrowserContext,
  TGetPWComponents,
} from '@GBB/types'

import { Automate } from '../automate'
import { pwBrowsers } from './PWBrowsers'
import { Logger } from '@GBB/utils/logger'
import { ENVS } from '@gobletqa/environment'
import { emptyObj } from '@keg-hub/jsutils/emptyObj'
import { getBrowserType } from '@GBB/utils/getBrowserType'
import { getContextOpts } from '@GBB/utils/getContextOpts'
import { buildBrowserConf } from '@GBB/utils/buildBrowserConf'
import { GobletQAUrl, CreateBrowserRetry } from '@GBB/constants'
import { checkInternalPWContext } from './checkInternalPWContext'

const logMsg = (msg:string, method:string=`verbose`, ...rest:any[]) => {
  !ENVS.GOBLET_RUN_FROM_CI
    && !ENVS.GOBLET_RUN_FROM_UI
    && Logger[method](msg, ...rest)
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
    world,
    config,
    browserConf,
    initialUrl=GobletQAUrl,
    overrides=emptyObj as TBrowserConf,
  }:TGetPage):Promise<TPWComponents> => {

    try {

      const { context, browser } = await this.#getContext({
        world,
        config,
        overrides,
        browserConf,
      })

      const pages = context.pages()
      
      logMsg(`getPage - Found ${pages.length} pages open on the context`)
      
      const hasPages = Boolean(pages.length)
      const hasMultiplePages = pages.length > 1

      if(hasMultiplePages){
        logMsg(`getPage - Closing extra pages on the context`)
        await Promise.all(pages.map(async (page, idx) => idx && await page.close()))
      }

      // Hack due to multiple calls on frontend startup
      // If more then one calls, and the browser is not create
      // then it will create two browsers
      // So this re-calls the same method when creatingBrowser is set
      // To allow consecutive calls on start up
      if(!hasPages && this.creatingPage)
        return new Promise((res, rej) => {
          logMsg(`getPage - Browser Page is creating, try agin in ${CreateBrowserRetry}ms`, `info`)
          setTimeout(() => res(this.#getPage({
            initialUrl,
            browserConf
          })), CreateBrowserRetry)
        })

      let page:TBrowserPage
      this.creatingPage = true
      if(hasPages){
        page = pages[0]
        const currentUrl = page.url()
        currentUrl === `about:blank`
          && await page.goto(initialUrl)

      }
      else {

        page = await context.newPage()

        try {
          await page.goto(initialUrl)
        }
        catch(err){
          console.error(err)
        }
      }

      this.creatingPage = false
      const browserType = browser.browserType?.().name?.()

      if(!ENVS.GOBLET_RUN_FROM_CI && !ENVS.GOBLET_RUN_FROM_UI){
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
      world,
      config,
      browserConf,
      overrides=emptyObj as TBrowserConf,
    } = args


    const resp = await pwBrowsers.getBrowser({ world, config, browserConf })

    let context = resp.context
    const browser = resp.browser
    
    if(!context){
      const contexts = browser.contexts()
      const hasContexts = Boolean(contexts.length)
      const hasMultipleContexts = contexts.length > 1

      if(hasMultipleContexts){
        logMsg(`getContext - Closing extra contexts on the browser`)
        await Promise.all(contexts.map(async (context, idx) => idx && await context.close()))
      }

      const options = getContextOpts({
        world,
        config,
        overrides: overrides.context,
        contextOpts: browserConf.context,
      })
      
      logMsg(`Context Options`, `verbose`, options)

      if(hasContexts){
        context = contexts[0] as TBrowserContext
        logMsg(`getContext - Found existing context on browser ${browserConf.type}`)
      }
      else {
        context = await browser.newContext(options) as TBrowserContext
        context.__contextGoblet = { options }

        logMsg(`getContext - New context created for browser ${browserConf.type}`)

        Automate.bind({ parent: context })
      }

    }
    else {
      logMsg(`getContext - Found Persistent context for browser ${browserConf.type}`)
    }

    return { context, browser }
  }

  #getBrowser = async (args:TBrowserOnly) => {
    const { world, config, browserServer } = args

    const resp = await pwBrowsers.getBrowser({
      world,
      config,
      opts: { browserServer },
      browserConf: buildBrowserConf(args),
    })

    return resp as TPWComponents
  }

  server = async (args:TBrowserOnly) => this.#getBrowser(args)

  start = async (args:TStartBrowser):Promise<TPWComponents> => {
    return await pwBrowsers.startBrowser(args, this.#getPage as TGetPageCB)
  }

  get = async (args:TGetPWComponents) => {
    const {
      world,
      config,
      initialUrl=GobletQAUrl,
      browserConf=emptyObj as TBrowserConf,
    } = args

    const pwComponents = checkInternalPWContext(getBrowserType(browserConf.type as EBrowserType))

    return pwComponents?.page
      ? pwComponents
      : await this.#getPage({
          world,
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