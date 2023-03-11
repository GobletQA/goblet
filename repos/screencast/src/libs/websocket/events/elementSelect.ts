import type { Express } from 'express'
import type { Socket } from 'socket.io'
import type {
  SocketManager,
  TSocketEvtCBProps,
} from '@GSC/types'


import { startBrowser } from '@GSC/libs/playwright/browser/browser'
import { Automate } from '@GSC/libs/playwright/automate/automate'
import { joinBrowserConf } from '@gobletqa/shared/utils/joinBrowserConf'

const handleSelectElement = async (
  data:Record<any, any>,
  socket:Socket,
  Manager:SocketManager,
  app:Express
) => {

  const browserConf = joinBrowserConf({ addAutomate: true }, app)
  const pwComponents = await startBrowser(browserConf)
  await Automate.turnOnElementSelect(pwComponents, data)

  // Manager.emit(socket, WS_PW_URL_CHANGE, {data: { url }, group: socket.id })
  // TODO: Add listener to send the selected element back to the FE via websocket

}

export const elementSelect = (app:Express) => {
  return async ({ data, socket, Manager, user }:TSocketEvtCBProps) => {


    await handleSelectElement(data, socket, Manager, app)
  }
}
