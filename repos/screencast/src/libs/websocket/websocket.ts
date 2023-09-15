import type { Server } from 'http'
import type { Express } from 'express'
import * as SocketEvents from './events'
import type { TSocketConfig } from '@gobletqa/shared/types'

import { socketInit } from './setup'
import { emptyObj } from '@keg-hub/jsutils/emptyObj'

const {
  examRun,
  authToken,
  connection,
  disconnect,
  browserPlay,
  browserRecord,
  browserRestart,
  cancelAutomate,
  browserAutomate,
} = SocketEvents

const defConfig = emptyObj as TSocketConfig

export type TInitSocket = (
  app:Express,
  server:Server,
  config:TSocketConfig,
  cmdType?:string
) => Promise<any>

/**
 * Init websocket passing in the custom event listeners
 */
export const initSocket:TInitSocket = (
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
        examRun: examRun(app),
        authToken: authToken(app),
        disconnect: disconnect(app),
        connection: connection(app),
        browserPlay: browserPlay(app),
        browserRecord: browserRecord(app),
        browserRestart: browserRestart(app),
        cancelAutomate: cancelAutomate(app),
        browserAutomate: browserAutomate(app),
      },
    },
    cmdType
  )
}
