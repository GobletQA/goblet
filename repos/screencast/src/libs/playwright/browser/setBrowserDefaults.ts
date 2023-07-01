import type { TBrowserContext, TBrowserPage, TRepo, TSetBrowserDefaults } from '@GSC/types'


import { getPWComponents } from '@GSC/libs/playwright/browser/browser'
import { joinBrowserConf } from '@gobletqa/shared/utils/joinBrowserConf'

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


const setContextSettings = async ({
  repo,
  context,
  headers,
}:TSetContextSettings) => {
  if(!repo) return

  const extraHeaders = repo?.world?.$headers

  if(headers !== false && extraHeaders){
    await context.setExtraHTTPHeaders(extraHeaders)
    // TODO: This is terrible, but it's a quick hack
    // Need to update later
    context.__goblet = context.__goblet || {}
    context.__goblet.extraHeaders = {
      ...context?.__goblet?.extraHeaders,
      ...extraHeaders
    }
  }

  const contextSettings = repo?.world?.$context
  if(contextSettings){
    contextSettings?.timeout &&
      context.setDefaultTimeout(contextSettings?.timeout || 5000)

    // Add context settings here
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