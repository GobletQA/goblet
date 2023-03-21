import type { Express } from 'express'
import type { Socket } from 'socket.io'
import type {
  SocketManager,
  TSocketEvtCBProps,
} from '@GSC/types'

import { Automate } from '@GSC/libs/playwright/automate/automate'
import { startBrowser } from '@GSC/libs/playwright/browser/browser'
import { joinBrowserConf } from '@gobletqa/shared/utils/joinBrowserConf'
import { ExpressionKinds, ExpressionTypes } from '@gobletqa/shared/constants'

const onBrowserAutomate = async (
  data:Record<any, any>,
  socket:Socket,
  Manager:SocketManager,
  app:Express
) => {

  const browserConf = joinBrowserConf({ addAutomate: true }, app)
  const pwComponents = await startBrowser(browserConf)

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