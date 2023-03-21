import type { Server } from 'http'
import type { Express } from 'express'
import * as SocketEvents from './events'
import type { TSocketConfig } from '@gobletqa/shared/types'

import { socketInit } from './setup'
import { noOpObj } from '@keg-hub/jsutils'

const {
  authToken,
  connection,
  disconnect,
  browserPlay,
  browserRecord,
  browserAutomate,
} = SocketEvents

const defConfig = noOpObj as TSocketConfig

/**
 * Init websocket passing in the custom event listeners
 */
export const initSocket = (
  app:Express,
  server:Server,
  config:TSocketConfig = defConfig,
  cmdType?:string
) => {
  return socketInit(
    server,
    {
      ...config,
      events: {
        authToken: authToken(app),
        disconnect: disconnect(app),
        connection: connection(app),
        browserPlay: browserPlay(app),
        browserRecord: browserRecord(app),
        browserAutomate: browserAutomate(app),
      },
    },
    cmdType
  )
}
