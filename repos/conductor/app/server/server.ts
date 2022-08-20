import type { TServerConfig } from '@gobletqa/conductor/types'

import http from 'http'
import https from 'https'
import { Express } from 'express'
import { getApp } from '@gobletqa/shared/express/app'
import {
  setupRouters,
  setupAuthUser,
  setupValidationHeader
} from '@gobletqa/conductor/middleware'

import {
  setupJWT,
  setupCors,
  setupServer,
  setupLoggerReq,
  setupLoggerErr,
  setupServerListen,
} from '@gobletqa/shared/middleware'

export const createServer = (config:TServerConfig, localDevMode:boolean=false) => {
  const app = getApp() as Express

  setupLoggerReq(app)
  setupCors(app)
  setupValidationHeader(app)

  localDevMode !== true && setupJWT(app, [`/`])

  setupAuthUser(app)
  setupServer(app, false, false)
  setupRouters(app)

  const { insecureServer, secureServer } = setupServerListen(app, app.locals.config.server)
  setupLoggerErr(app)

  const server = (secureServer as https.Server) || (insecureServer as http.Server)

  return {
    app,
    server,
    secureServer,
    insecureServer
  }

} 