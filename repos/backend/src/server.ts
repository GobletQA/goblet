#!/usr/bin/env node
import '../resolveRoot'
import type { Express } from 'express'
import { initSockr } from '@GBE/services/sockr'
import { getApp } from '@gobletqa/shared/express/app'
import { backendConfig } from '@GBE/Configs/backend.config'
import { isDeployedEnv } from '@gobletqa/shared/utils/isDeployedEnv'
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

// import { setupVNCProxy } from '@gobletqa/shared/middleware/setupVNCProxy'

/**
 * Starts a express API server, and connects the sockr Websocket
 * Loads the Goblet Config, which is used for configuring the server
 *
 * @returns {Object} - Express app, server and socket.io socket
 */
export const initApi = async () => {
  const app = getApp(backendConfig) as Express
  const { sockr, server:serverConf } = app.locals.config

  setupLoggerReq(app)
  setupBlacklist(app)
  setupCors(app)
  setupJWT(app, ['/auth/validate'])
  setupServer(app, false)
  await setupConductor(app)
  setupRouters(app)
  setupStatic(app)
  validateUser(app, `/repo\/*`, `async`)
  await setupEndpoints()
  setupLoggerErr(app)

  // const wsProxy = setupVNCProxy(app)
  // server.on('upgrade', wsProxy.upgrade)
  const {
    secureServer,
    insecureServer,
  } = setupServerListen(app, { name: `Backend`, ...serverConf })

  const server = secureServer || insecureServer
  const socket = await initSockr(app, server, sockr, 'tests')

  return { app, server, socket }
}

/**
 * Ensure nodemon restarts properly
 * Sometimes nodemon tries to restart faster then the process can shutdown
 * This should force kill the process when it receives the SIGUSR2 event from nodemon
 * Taken from https://github.com/standard-things/esm/issues/676#issuecomment-766338189
 */
!isDeployedEnv &&
  process.once('SIGUSR2', () => process.kill(process.pid, 'SIGUSR2'))

