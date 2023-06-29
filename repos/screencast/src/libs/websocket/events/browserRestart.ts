import type { Express } from 'express'
import type { TSocketEvtCBProps } from '@GSC/types'

import { GobletQAUrl } from '@GSC/constants'
import { joinBrowserConf } from '@gobletqa/shared/utils/joinBrowserConf'
import { browserEvents } from '@GSC/libs/playwright/browser/browserEvents'
import {
  startBrowser,
  getPWComponents,
} from '@GSC/libs/playwright/browser/browser'

// import {Repo} from '@gobletqa/shared/repo'
// import {
//   // setContextCookie,
//   // saveContextCookie,
//   contextStorageLoc,
//   saveContextStorageState,
// } from '@gobletqa/testUtils/playwright/browserCookie'


export const browserRestart = (app:Express) => {
  return async (props:TSocketEvtCBProps) => {
    const { data, user } = props
    
    // const { repo } = await Repo.status(app.locals.config, { ...data.repo, ...user })
    // let extraCtxOpts:Record<any, any> = {
    //     extraHTTPHeaders: repo.world.$headers || {}
    // }
    let extraCtxOpts:Record<any, any> = {}
      

    const browserConf = joinBrowserConf(data.browser)
    const { context, page } = await getPWComponents(browserConf)

    // TODO: more a lot of this to setBrowserDefaults
    const pageUrl = page.url()

    const url = pageUrl !== GobletQAUrl
      ? pageUrl
      : data.url || GobletQAUrl

    if(context){
      // TODO: FIX this hack
      if(context?.__goblet?.extraHeaders)
        extraCtxOpts.extraHTTPHeaders = {
          ...extraCtxOpts.extraHTTPHeaders,
          ...context?.__goblet?.extraHeaders
        }

      // TODO: need to investigate
      // Should be working but causes an error on useverb site
      // extraCtxOpts.storageState = await context.storageState()
      // await saveContextStorageState(context)
      // extraCtxOpts.storageState = contextStorageLoc()
      // savedCookie = await saveContextCookie(context)
      context && await context.close()
    }

    const confOverrides = extraCtxOpts.extraHTTPHeaders
      ? {...browserConf, context: extraCtxOpts }
      : browserConf

    await startBrowser(browserConf, false, false, confOverrides, url)

    const pwComponents = await getPWComponents(browserConf)

    // Reset the cookies if they were saved
    // savedCookie && await setContextCookie(pwComponents.context)

    browserEvents(app, {
      ...props,
      pwComponents,
      browser: browserConf,
    })

  }
}

