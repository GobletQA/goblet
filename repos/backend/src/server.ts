#!/usr/bin/env node
import '../resolveRoot'
import type { Express } from 'express'
import { BEAuthBypassRoutes } from '@GBE/constants'
import { getApp } from '@gobletqa/shared/api/express/app'
import { backendConfig } from '@GBE/Configs/backend.config'
import {
  setupServer,
  setupRouter,
  setupEndpoints,
  setupConductor,
} from '@GBE/middleware'
import {
  setupJWT,
  setupCors,
  validateUser,
  setupRateLimit,
  setupLoggerReq,
  setupLoggerErr,
  setupServerListen,
} from '@gobletqa/shared/api/middleware'


/**
 * Starts a express API server, and connects the Websocket
 * Loads the Goblet Config, which is used for configuring the server
 *
 * @returns {Object} - Express app, server and socket.io socket
 */
export const initApi = async () => {
  const app = getApp(backendConfig) as Express

  setupLoggerReq(app)
  setupRateLimit(app)
  setupCors(app)
  setupJWT(app, BEAuthBypassRoutes)
  setupServer(app)
  setupRouter(app)
  validateUser({
    bypassRoutes: BEAuthBypassRoutes,
    route: /(\/repo\/*|\/auth\/claims\/*)/,
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
