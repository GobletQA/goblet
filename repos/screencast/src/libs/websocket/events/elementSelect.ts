import type { Express } from 'express'
import type { Socket } from 'socket.io'
import type {
  SocketManager,
  TSocketEvtCBProps,
} from '@GSC/types'


import { startBrowser } from '@GSC/libs/playwright/browser/browser'
import { turnOnElementSelect } from '@GSC/libs/playwright/automate/helpers'
import { joinBrowserConf } from '@gobletqa/shared/utils/joinBrowserConf'

const handleSelectElement = async (
  data:Record<any, any>,
  socket:Socket,
  Manager:SocketManager,
  app:Express
) => {

  // TODO: Add listener to send the selected element back to the FE via websocket

  const browserConf = joinBrowserConf({ addAutomate: true }, app)
  const pwComponents = await startBrowser(browserConf)
  const { page } = pwComponents
  await turnOnElementSelect(page)

}

export const elementSelect = (app:Express) => {
  return async ({ data, socket, Manager, user }:TSocketEvtCBProps) => {


    await handleSelectElement(data, socket, Manager, app)
  }
}
