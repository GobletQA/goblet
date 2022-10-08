#!/usr/bin/env node
import '../../resolveRoot'
import type { TExpApp } from '@GKD/Types'
import type { Express } from 'express'
import { Logger } from '@keg-hub/cli-utils'
import { AUTH_BYPASS_ROUTES } from '@GKD/Constants'
import { getApp } from '@gobletqa/shared/express/app'
import { config } from '@GKD/Configs/kind.config'
import {
  setupKubectl,
  setupRouters,
  setupKubeProxy,
  setupEndpoints,
} from '@GKD/Middleware'
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


const ignoreError = [
  `connect ECONNREFUSED`,
  `(HTTP code 404) no such container`,
]

/**
 * There are some cases where we don't want to exit when an UncaughtException is thrown
 * In those cases the error is logged instead
 *
 */
const handleUncaughtExp = (exitCode:number=0, err:Error) => {
  const shouldIgnore = ignoreError.find(text => err?.message?.includes(text))
  
  
  if(exitCode && shouldIgnore) {
      Logger.log([
        `\n`,
        Logger.colors.red(`------ [Server Error] ------`),
        `Docker API server is not responding properly`,
        err.stack,
        `\n`,
      ].join(`\n`))

    return true
  }
}

/**
 * Starts a express API server, and connects the sockr Websocket
 * Loads the Goblet Config, which is used for configuring the server
 *
 * @returns {Object} - Express app, server and socket.io socket
 */
export const initApi = async () => {
  const app = getApp(config) as Express

  setupLoggerReq(app)
  setupBlacklist(app)
  setupCors(app)
  // setupJWT(app, AUTH_BYPASS_ROUTES)
  setupServer(app, false, false, false)
  setupRouters(app)
  setupStatic(app)
  // validateUser(app, `/kube\/*`, `async`)
  setupKubectl(app)
  
  setupKubeProxy(`/kube`, app?.locals?.config?.kubeProxy)
  await setupEndpoints()
  setupLoggerErr(app)

  const {
    secureServer,
    insecureServer,
  } = setupServerListen({
    app,
    exitTimeout: 3000,
    exitListener: true,
    uncaughtExpCB: handleUncaughtExp,
    config: { name: `Backend`, ...app?.locals?.config?.server },
  })

  const server = secureServer || insecureServer
 
  return { app, server }
}
