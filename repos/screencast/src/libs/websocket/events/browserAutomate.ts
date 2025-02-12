import type { Express } from 'express'
import type { TSocketEvtCBProps } from '@GSC/types'

import { withRepo } from '@GSC/utils/withRepo'
import { GBrowser, Automate } from '@gobletqa/browser'
import { joinBrowserConf } from '@GSC/utils/joinBrowserConf'
import { ExpressionKinds } from '@gobletqa/environment/constants'


export const browserAutomate = (app:Express) => withRepo<TSocketEvtCBProps>(async ({
  repo,
  data,
}) => {
  const browserConf = joinBrowserConf(data.browser, app)
  const pwComponents = await GBrowser.get({ browserConf, config: repo })

  switch(data?.selectorType){
    case ExpressionKinds.url: {
      return await Automate.getPageUrl(pwComponents, data)
    }
    case ExpressionKinds.iframe: {
      return await Automate.getPageFrames(pwComponents, data)
    }
    default: {
      return await Automate.turnOnElementSelect(pwComponents, data)
    }
  }
})

