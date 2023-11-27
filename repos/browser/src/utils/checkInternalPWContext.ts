import type { Browser, BrowserType, CDPSession } from 'playwright'
import type {
  TBrowser,
  TBrowserPage,
  EBrowserName,
  TPWComponents,
  TStopTraceOpts,
  TStartTraceOpts,
  TBrowserContext,
} from '@GBB/types'

import playwright from 'playwright'
import { EventEmitter } from 'node:events'

/**
 * This class represents mock browser instance that used in cases where it's not created
 * This happens when the using the persistent-context option of playwright
 * It ensures the API is consistent with a normal browser instance
 */
// @ts-ignore
export class EmptyBrowser extends EventEmitter implements Browser {
  #type:BrowserType
  #context:TBrowserContext
  #disconnectedCB:(browser:Browser) => void

  constructor(context:TBrowserContext, browserType:EBrowserName){
    super()
    this.#context = context
    this.#type = browserType as unknown as BrowserType
  }

  on = (evt:string, cb:(browser:Browser) => void) => {
    super.on(evt, cb)

    this.#disconnectedCB = cb
    return this
  }

  browserType = () => this.#type
  newBrowserCDPSession = async () => ({} as CDPSession)
  contexts = () => [this.#context]
  version = () => `empty-browser@v1`
  newContext = async () => this.#context
  isConnected = () => Boolean(this.#context)
  newPage = async () => {
    return await this.#context?.newPage()
  }
  stopTracing = async (opts?:TStopTraceOpts) => {
    await this.#context.tracing.stop(opts)
    return Buffer.from('goblet-empty-browser')
  }
  startTracing = async (page?:TBrowserPage, opts?:TStartTraceOpts) => {
    if(!opts && page) opts = page as unknown as TStartTraceOpts
    return await this.#context.tracing.start(opts)
  }

  close = async () => {
    this.#disconnectedCB?.(this as unknown as Browser)
    await this.#context?.close?.()
    this.#context = undefined
  }
}


/**
  This method gets the context from the playwright module directly
  Which then allows getting the browser and pages
  This uses internal references to properties that are not intended to be exposed
  So it may cause issues to depend on it exclusively
  
  It has the added benefit of not needing to manage cache playwright components internally
 */

export const checkInternalPWContext = (type:EBrowserName):TPWComponents|undefined => {
  // @ts-ignore
  const contexts = playwright[type]?._contexts
  if(!contexts?.size) return undefined

  const context = [...contexts][0]
  let browser:TBrowser = context?.browser?.()
  // @ts-ignore
  if(context && browser === null) browser = new EmptyBrowser(context, type)

  const components = { browser, context } as TPWComponents

  if(!context?._pages?.size) return components

  const page:TBrowserPage = [...context?._pages][0]
  page && (components.page = page)

  return components
}