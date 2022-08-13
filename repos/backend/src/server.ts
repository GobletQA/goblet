#!/usr/bin/env node
import '../resolveRoot'
import apiEndpoints from '@GBE/endpoints'
import { initSockr } from '@GBE/Sockr/sockr'
import { getApp } from '@gobletqa/shared/express/app'
import { backendConfig } from '@GBE/Configs/backend.config'
import { isDeployedEnv } from '@gobletqa/shared/utils/isDeployedEnv'
import {
  setReqRepo,
  setupVNCProxy,
  validateUser,
  setupConductorProxy,
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
} from '@gobletqa/shared/middleware'

/**
 * Starts a express API server, and connects the sockr Websocket
 * Loads the Goblet Config, which is used for configuring the server
 *
 * @returns {Object} - Express app, server and socket.io socket
 */
export const initApi = async () => {
  const app = getApp(backendConfig)
  const { sockr, server:serverConf } = app.locals.config

  setupLoggerReq(app)
  setupBlacklist(app)
  setupCors(app)
  setupJWT(app, ['/auth/validate'])
  setupServer(app)
  setupStatic(app)
  validateUser(app)
  setupConductorProxy(app)
  setReqRepo(app)
  apiEndpoints(app)
  setupLoggerErr(app)

  const wsProxy = setupVNCProxy(app)
  const {
    secureServer,
    insecureServer,
  } = setupServerListen(app, { name: `Backend`, ...serverConf })

  const server = secureServer || insecureServer
  server.on('upgrade', wsProxy.upgrade)
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

