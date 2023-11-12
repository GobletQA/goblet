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
import { EBrowserEvent } from '@GBB/types'
import { logEnvMsg } from '@GBB/utils/logger'
import { emptyObj } from '@keg-hub/jsutils/emptyObj'
import { getBrowserType } from '@GBB/utils/getBrowserType'
import { getContextOpts } from '@GBB/utils/getContextOpts'
import { buildBrowserConf } from '@GBB/utils/buildBrowserConf'
import { GobletQAUrl, CreateBrowserRetry } from '@GBB/constants'
import { checkInternalPWContext } from '@GBB/utils/checkInternalPWContext'

export class Browser {

  browser:TBrowser
  page:TBrowserPage
  context:TBrowserContext
  creatingPage:boolean=false
  close=pwBrowsers.closeBrowser

  constructor(){}

  #getPage = async ({
    config,
    world=config?.world,
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
      
      logEnvMsg(`getPage - Found ${pages.length} pages open on the context`)
      
      const hasPages = Boolean(pages.length)
      const hasMultiplePages = pages.length > 1

      if(hasMultiplePages){
        logEnvMsg(`getPage - Closing extra pages on the context`)
        await Promise.all(pages.map(async (page, idx) => idx && await page.close()))
      }

      // Hack due to multiple calls on frontend startup
      // If more then one calls, and the browser is not create
      // then it will create two browsers
      // So this re-calls the same method when creatingBrowser is set
      // To allow consecutive calls on start up
      if(!hasPages && this.creatingPage)
        return new Promise((res, rej) => {
          logEnvMsg(`getPage - Browser Page is creating, try agin in ${CreateBrowserRetry}ms`, `info`)
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
          && initialUrl
          && await page.goto(initialUrl)

      }
      else {

        page = await context.newPage()

        try {
          initialUrl
            && await page.goto(initialUrl)
        }
        catch(err){
          console.error(err)
        }
      }

      this.creatingPage = false
      const browserType = browser.browserType?.().name?.()

      hasPages
        ? logEnvMsg(`getPage - Found page on context for browser ${browserType}`)
        : logEnvMsg(`getPage - New page created on context for browser ${browserType}`)

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
      world=config?.world,
      browserConf,
      overrides=emptyObj as TBrowserConf,
    } = args


    const resp = await pwBrowsers.getBrowser({
      world,
      config,
      browserConf
    })

    let context = resp.context
    const browser = resp.browser
    
    if(!context){
      const contexts = browser.contexts()
      const hasContexts = Boolean(contexts.length)
      const hasMultipleContexts = contexts.length > 1

      if(hasMultipleContexts){
        logEnvMsg(`getContext - Closing extra contexts on the browser`)
        await Promise.all(contexts.map(async (context, idx) => idx && await context.close()))
      }

      const options = getContextOpts({
        world,
        config,
        overrides: overrides.context,
        contextOpts: browserConf.context,
      })
      
      logEnvMsg(`Context Options`, `verbose`, options)

      if(hasContexts){
        context = contexts[0] as TBrowserContext
        logEnvMsg(`getContext - Found existing context on browser ${browserConf.type}`)
      }
      else {
        context = await browser.newContext(options) as TBrowserContext
        context.__contextGoblet = { options }
        logEnvMsg(`getContext - New context created for browser ${browserConf.type}`)
      }
    }
    else {
      logEnvMsg(`getContext - Found Persistent context for browser ${browserConf.type}`)
    }

    !context.__GobletAutomateInstance
      && Automate.bind({ parent: context })

    context.on(EBrowserEvent.close, async () => {
      if(context.__GobletAutomateInstance){
        let automate = context.__GobletAutomateInstance
        await automate.cleanUp()
        automate = undefined
        context.__GobletAutomateInstance = undefined
      }
      if(context.__contextGoblet){
        context.__contextGoblet.initFuncs = undefined
        context.__contextGoblet.initScript = undefined
        context.__contextGoblet = undefined
      }
    })

    return { context, browser }
  }

  #getBrowser = async (args:TBrowserOnly) => {
    const {
      config,
      world=config?.world,
      browserServer
    } = args

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
    const {
      config,
      world=config?.world
    } = args
    
    return await pwBrowsers.startBrowser({
      ...args,
      world
    }, this.#getPage as TGetPageCB)
  }

  restart = async (args:TStartBrowser):Promise<TPWComponents> => {
    await pwBrowsers.closeBrowser(args?.browserConf?.type as EBrowserType)
    return await this.start(args)
  }

  get = async (args:TGetPWComponents) => {
    const {
      config,
      world=config?.world,
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
