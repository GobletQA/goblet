import type { Browser, BrowserType, CDPSession } from 'playwright'
import type {
  TBrowserPage,
  EBrowserName,
  TStopTraceOpts,
  TStartTraceOpts,
  TBrowserContext,
} from '@GSC/types'

import { ghostMouse } from './ghostMouse'
import { EventEmitter } from 'node:events'

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
    const pg = await this.#context?.newPage()
    const page = ghostMouse(pg)

    return page
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
