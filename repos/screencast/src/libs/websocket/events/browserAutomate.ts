import type { Express } from 'express'
import type { Socket } from 'socket.io'
import type {
  SocketManager,
  TUserAutomateOpts,
  TSocketEvtCBProps,
} from '@GSC/types'

import { ExpressionKinds } from '@GSC/constants'
import { withRepo } from '@GSC/utils/withRepo'
import { GBrowser, Automate } from '@gobletqa/browser'
import { joinBrowserConf } from '@GSC/utils/joinBrowserConf'


export const browserAutomate = (app:Express) => withRepo<TSocketEvtCBProps>(async ({
  repo,
  data,
}) => {
  const browserConf = joinBrowserConf(data.browser, app)
  const pwComponents = await GBrowser.start({ browserConf, config: repo })

  switch(data?.selectorType){
    case ExpressionKinds.url: {
      return await Automate.getPageUrl(pwComponents, data)
    }
    default: {
      return await Automate.turnOnElementSelect(pwComponents, data)
    }
  }
})

