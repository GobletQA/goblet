import type { Server } from 'http'
import type { Express } from 'express'
import type { TSockrConfig } from '@GBE/types'
import * as SkrEvents from './events'
import { noOpObj } from '@keg-hub/jsutils'
import { validateToken }  from './validateToken'
import { sockr } from '@ltipton/sockr/src/server'
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

const defConfig = noOpObj as TSockrConfig

/**
 * Init sockr passing in the custom event listeners
 */
export const initSockr = (app:Express, server:Server, config:TSockrConfig = defConfig, cmdType?:string) => {
  return sockr(
    server,
    {
      ...config,
      events: {
        ...config?.events,
        ...customEvents,
        authToken: authToken(app),
        disconnect: disconnect(app),
        connection: connection(app),
        repoStatus: validateToken(app, repoStatus(app)),
        browserStatus: validateToken(app, browserStatus(app)),
        browserRunTests: validateToken(app, browserRunTests(app)),
        browserRecorder: validateToken(app, browserRecorder(app)),
      },
    },
    cmdType
  )
}
