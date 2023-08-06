import type { TWorldConfig } from '@ltipton/parkin'
import type {
  TRepo,
  TBrowserPage,
  TBrowserContext,
  TBrowserContextOpts,
  TGobletConfig,
  TBrowserConf,
  TPWComponents
} from '@GBB/types'

import {emptyObj, isStr} from '@keg-hub/jsutils'

import {
  getPWComponents,
  setContextCookie,
  contextStorageLoc,
  saveContextCookie,
  saveContextStorageState,
} from '@gobletqa/browser'

export type TSetBrowserDefaults = {
  headers?:boolean
  url?:boolean|string
  config:TGobletConfig
  browserConf:TBrowserConf
  pwComponents?:TPWComponents
}

export type TSetContextSettings = {
  headers?:boolean
  config?:TGobletConfig
  context?:TBrowserContext
}

export type TSetPageSettings = {
  page?:TBrowserPage
  url?:boolean|string
  config?:TGobletConfig
}

// TODO: need to investigate, needs cleaned up a bit
// Should be working but causes an error on some website
const setContextState = async (
  context:TBrowserContext,
  ctxOpts:Partial<TBrowserContextOpts>=emptyObj,
  world:TWorldConfig
) => {

  const options = {...world?.$context, ...ctxOpts}
  const storageLoc = options?.storageState?.path || contextStorageLoc()
  const storageData = await saveContextStorageState(context, storageLoc)
  const savedCookie = await saveContextCookie(context)
  // Reset the cookies if they were saved
  savedCookie && await setContextCookie(context)
}

export const setContextHeaders = async (
  context:TBrowserContext,
  headers:Record<string, string>
) => {

  await context.setExtraHTTPHeaders(headers)
  // TODO: Hack to store extraHTTPHeaders, Need to update this at some point
  context.__goblet = context.__goblet || {}
  context.__goblet.extraHTTPHeaders = headers
}

const setContextSettings = async ({
  config,
  context,
  headers,
}:TSetContextSettings) => {
  if(!config) return
  
  if(headers !== false)
    await setContextHeaders(context, {
      ...context?.__goblet?.extraHTTPHeaders,
      ...config?.world?.$context?.extraHTTPHeaders,
      ...config?.world?.$headers
    })

  const contextSettings = config?.world?.$context
  if(contextSettings){
    contextSettings?.timeout &&
      context.setDefaultTimeout(contextSettings?.timeout)
  }

}

const setPageSettings = async ({
  url,
  config,
  page,
}:TSetPageSettings) => {
  if(!config) return

  const browserSettings = config?.world?.$browser
  if(browserSettings){
    browserSettings?.timeout &&
      page.setDefaultTimeout(browserSettings?.timeout)

     // Add page settings here
  }

  const appUrl = isStr(url) && url
    || config?.world?.url
    || config?.world?.app?.url

  url !== false
    && appUrl
    && await page.goto(appUrl)

}
 

export const setBrowserDefaults = async (props:TSetBrowserDefaults) => {
  const {
    url,
    config,
    headers,
    browserConf,
    pwComponents,
  } = props

  const { context, page } = pwComponents || await getPWComponents({ config, browserConf })

  await setContextSettings({
    config,
    context,
    headers,
  })

  await setPageSettings({
    url,
    config,
    page,
  })

  // TODO: Add default timeout and other config from the mounted users goblet-config
  // config.playwright.browser
  // config.playwright.page
  // config.playwright.context
}