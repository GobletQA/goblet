import type { Server } from 'http'
import type { Express } from 'express'
import * as SocketEvents from './events'
import type { TSocketConfig } from '@gobletqa/shared/types'

import { socketInit } from './setup'
import { emptyObj } from '@keg-hub/jsutils/emptyObj'

const {
  testsRunAll,
  testsRunAbort,
  authToken,
  connection,
  disconnect,
  browserPlay,
  browserRecord,
  browserRestart,
  cancelAutomate,
  browserAutomate,
  jokerSendMessage,
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
        // ---- User Session Events ----
        authToken: authToken(app),
        disconnect: disconnect(app),
        connection: connection(app),

        // ---- Browser Single Test Run Events ----
        browserPlay: browserPlay(app),
        browserRecord: browserRecord(app),
        browserRestart: browserRestart(app),

        // ---- Browser Automation Events ----
        cancelAutomate: cancelAutomate(app),
        browserAutomate: browserAutomate(app),

        // ---- Full Test Suite Events ----
        testsRunAll: testsRunAll(app),
        testsRunAbort: testsRunAbort(app),

        // ---- Joker AI Events ----
        jokerSendMessage: jokerSendMessage(app)
      },
    },
    cmdType
  )
}
