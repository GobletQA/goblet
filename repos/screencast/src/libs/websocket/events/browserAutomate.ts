import type { Express } from 'express'
import type { Socket } from 'socket.io'
import type {
  SocketManager,
  TUserAutomateOpts,
  TSocketEvtCBProps,
} from '@GSC/types'

import { startBrowser, Automate } from '@gobletqa/browser'
import { ExpressionKinds } from '@gobletqa/shared/constants'
import { joinBrowserConf } from '@gobletqa/shared/utils/joinBrowserConf'

const onBrowserAutomate = async (
  data:TUserAutomateOpts,
  socket:Socket,
  Manager:SocketManager,
  app:Express
) => {

  const browserConf = joinBrowserConf(data.browser, app)
  const pwComponents = await startBrowser({ browserConf })

  switch(data?.selectorType){
    case ExpressionKinds.url: {
      return await Automate.getPageUrl(pwComponents, data)
    }
    default: {
      return await Automate.turnOnElementSelect(pwComponents, data)
    }
  }
}

export const browserAutomate = (app:Express) => {
  return async ({ data, socket, Manager, user }:TSocketEvtCBProps) => {
    await onBrowserAutomate(data, socket, Manager, app)
  }
}
