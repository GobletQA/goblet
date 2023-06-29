import type { TSetBrowserDefaults } from '@GSC/types'


import { getPWComponents } from '@GSC/libs/playwright/browser/browser'
import { joinBrowserConf } from '@gobletqa/shared/utils/joinBrowserConf'

export const setBrowserDefaults = async (props:TSetBrowserDefaults) => {
  const {
    url,
    repo,
    headers,
    pwComponents,
  } = props
  const browserConf = joinBrowserConf(props.browserConf)
  const { context, page } = pwComponents || await getPWComponents(browserConf)

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

  const appUrl = repo?.world?.url || repo?.world?.app?.url

  url !== false
    && appUrl
    && await page.goto(appUrl)


  // TODO: Add default timeout and other config from the mounted users goblet-config
  // config.screencast.browser
  // config.screencast.page
  // config.screencast.context

}