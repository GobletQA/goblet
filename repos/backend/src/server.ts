#!/usr/bin/env node
import '../resolveRoot'
import type { Express } from 'express'
import { AUTH_BYPASS_ROUTES } from '@GBE/constants'
import { getApp } from '@gobletqa/shared/express/app'
import { backendConfig } from '@GBE/Configs/backend.config'
import {
  setupRouters,
  setupEndpoints,
  setupConductor,
} from '@GBE/middleware'
import {
  setupJWT,
  setupCors,
  setupServer,
  setupStatic,
  setupBlacklist,
  setupLoggerReq,
  setupLoggerErr,
  setupServerListen,
  validateUser,
} from '@gobletqa/shared/middleware'


/**
 * Starts a express API server, and connects the Websocket
 * Loads the Goblet Config, which is used for configuring the server
 *
 * @returns {Object} - Express app, server and socket.io socket
 */
export const initApi = async () => {
  const app = getApp(backendConfig) as Express

  setupLoggerReq(app)
  setupBlacklist(app)
  setupCors(app)
  setupJWT(app, AUTH_BYPASS_ROUTES)
  setupServer(app, false, false, false)
  setupRouters(app)
  setupStatic(app)
  validateUser({
    route: `/repo\/*`,
    expressRouter: `async`,
    bypassRoutes: AUTH_BYPASS_ROUTES
  })
  await setupEndpoints()
  setupLoggerErr(app)

  const { onUpgrade } = await setupConductor(app)

  const {
    secureServer,
    insecureServer,
  } = setupServerListen({
    app,
    config: {
      name: `Backend`,
      ...app?.locals?.config?.server
    },
  })

  const server = secureServer || insecureServer
  server.on('upgrade', onUpgrade)

  return { app, server }
}
