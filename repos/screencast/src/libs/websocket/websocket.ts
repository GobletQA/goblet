import type { Server } from 'http'
import * as SkrEvents from './events'
import type { Express } from 'express'
import type { TSocketConfig } from '@gobletqa/shared/types'

import { socketInit } from './setup'
import { noOpObj } from '@keg-hub/jsutils'

const {
  authToken,
  repoStatus,
  connection,
  disconnect,
  browserStatus,
  browserRunTests,
  browserRecorder,
  ...customEvents
} = SkrEvents

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
        ...config?.events,
        ...customEvents,
        authToken: authToken(app),
        disconnect: disconnect(app),
        connection: connection(app),
        repoStatus: repoStatus(app),
        browserStatus: browserStatus(app),
        browserRunTests: browserRunTests(app),
        browserRecorder: browserRecorder(app),
      },
    },
    cmdType
  )
}
