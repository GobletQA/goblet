#!/usr/bin/env node
import '../resolveRoot'
import type { Express } from 'express'
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

/**
 * Starts a express API server, and connects the sockr Websocket
 * Loads the Goblet Config, which is used for configuring the server
 *
 * @returns {Object} - Express app, server and socket.io socket
 */
export const initApi = async () => {
  const app = getApp(backendConfig) as Express

  setupLoggerReq(app)
  setupBlacklist(app)
  setupCors(app)
  setupJWT(app, ['/auth/validate'])
  setupServer(app, false, false, false)
  setupRouters(app)
  setupStatic(app)
  validateUser(app, `/repo\/*`, `async`)
  await setupEndpoints()
  setupLoggerErr(app)

  const { vncProxy, wsProxy } = await setupConductor(app)

  const {
    secureServer,
    insecureServer,
  } = setupServerListen(app, { name: `Backend`, ...app?.locals?.config?.server })

  const server = secureServer || insecureServer
  server.on('upgrade', (req, ...args) => {
    req.url.includes(vncProxy?.path)
      ? vncProxy?.upgrade(req, ...args)
      : wsProxy?.upgrade(req, ...args)
  })

  return { app, server }
}

/**
 * Ensure nodemon restarts properly
 * Sometimes nodemon tries to restart faster then the process can shutdown
 * This should force kill the process when it receives the SIGUSR2 event from nodemon
 * Taken from https://github.com/standard-things/esm/issues/676#issuecomment-766338189
 */
!isDeployedEnv &&
  process.once('SIGUSR2', () => process.kill(process.pid, 'SIGUSR2'))

