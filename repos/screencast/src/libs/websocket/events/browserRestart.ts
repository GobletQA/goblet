import type { Express } from 'express'
import type { TSocketEvtCBProps } from '@GSC/types'
import { joinBrowserConf } from '@gobletqa/shared/utils/joinBrowserConf'
import { browserEvents } from '@GSC/libs/playwright/browser/browserEvents'
import { GobletQAUrl } from '@GSC/constants'
import {
  startBrowser,
  getPWComponents,
} from '@GSC/libs/playwright/browser/browser'


export const browserRestart = (app:Express) => {
  return async (props:TSocketEvtCBProps) => {
    const { data } = props

    const browserConf = joinBrowserConf(data.browser)
    const { context, page } = await getPWComponents(browserConf)

    const pageUrl = page.url()

    const url = pageUrl !== GobletQAUrl
      ? pageUrl
      : data.url || GobletQAUrl

    context && await context.close()

    await startBrowser(browserConf, false, false, browserConf, url)

    const pwComponents = await getPWComponents(browserConf)
    browserEvents(app, {
      ...props,
      pwComponents,
      browser: browserConf,
    })

  }
}

