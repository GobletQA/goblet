import type { TWorldConfig } from '@ltipton/parkin'
import type {
  TRepo,
  TBrowserPage,
  TBrowserContext,
  TBrowserContextOpts,
  TSetBrowserDefaults
} from '@GSC/types'


import {emptyObj} from '@keg-hub/jsutils'
import { getPWComponents } from '@GSC/libs/playwright/browser/browser'
import { joinBrowserConf } from '@gobletqa/shared/utils/joinBrowserConf'
import {
  setContextCookie,
  contextStorageLoc,
  saveContextCookie,
  saveContextStorageState,
} from '@gobletqa/test-utils/playwright/browserCookie'

export type TSetContextSettings = {
  repo?:TRepo
  headers?:boolean
  context?:TBrowserContext
}

export type TSetPageSettings = {
  repo?:TRepo
  url?:boolean
  page?:TBrowserPage
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
  repo,
  context,
  headers,
}:TSetContextSettings) => {
  if(!repo) return
  
  if(headers !== false)
    await setContextHeaders(context, {
      ...context?.__goblet?.extraHTTPHeaders,
      ...repo?.world?.$context?.extraHTTPHeaders,
      ...repo?.world?.$headers
    })

  const contextSettings = repo?.world?.$context
  if(contextSettings){
    contextSettings?.timeout &&
      context.setDefaultTimeout(contextSettings?.timeout || 5000)
  }

}

const setPageSettings = async ({
  url,
  repo,
  page,
}:TSetPageSettings) => {
  if(!repo) return

  const browserSettings = repo?.world?.$browser
  if(browserSettings){
    browserSettings?.timeout &&
      page.setDefaultTimeout(browserSettings?.timeout || 5000)

     // Add page settings here
  }

  const appUrl = repo?.world?.url || repo?.world?.app?.url

  url !== false
    && appUrl
    && await page.goto(appUrl)

}
 

export const setBrowserDefaults = async (props:TSetBrowserDefaults) => {
  const {
    url,
    repo,
    headers,
    pwComponents,
  } = props
  const browserConf = joinBrowserConf(props.browserConf)
  const { context, page } = pwComponents || await getPWComponents(browserConf)

  await setContextSettings({
    repo,
    context,
    headers,
  })

  await setPageSettings({
    url,
    repo,
    page,
  })

  // TODO: Add default timeout and other config from the mounted users goblet-config
  // config.screencast.browser
  // config.screencast.page
  // config.screencast.context

}