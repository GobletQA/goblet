import '@GSC/utils/logger'
import { onExit } from '@GSC/utils/onExit'
import { initSocket } from '@GSC/libs/websocket'
import { SCAuthBypassRoutes } from '@GSC/constants'
import { setupRepo } from '@GSC/middleware/setupRepo'
import { getApp } from '@gobletqa/shared/api/express/app'

import { screencastConfig } from '@GSC/Configs/screencast.config'
import {
  setupRouter,
  setupServer,
  setupBrowser,
  setupEndpoints
} from '@GSC/middleware'
import {
  setupJWT,
  setupCors,
  setupLoggerReq,
  setupLoggerErr,
  setupRateLimit,
  setupServerListen,
  validateUser,
} from '@gobletqa/shared/api/middleware'

/**
 * Starts a express API server for screencast
 * Loads the Goblet Config, which is used for configuring the server
 *
 * @returns {Object} - Express app, server and socket.io socket
 */
const initApi = async () => {

  const app = getApp(screencastConfig)

  await setupBrowser(app)
  setupLoggerReq(app)
  setupCors(app)
  setupJWT(app, SCAuthBypassRoutes)
  setupServer(app)
  setupRateLimit(app)
  setupRouter(app)
  validateUser({
    route: `/screencast\/*`,
    bypassRoutes: SCAuthBypassRoutes
  })
  setupRepo()
  await setupEndpoints()
  setupLoggerErr(app)

  const {
    secureServer,
    insecureServer,
  } = setupServerListen({
    app,
    config: {
      name: `Screencast`,
      ...app.locals.config.server
    }
  })

  const socketConf = app?.locals?.config?.socket
  const server = secureServer || insecureServer
  const socket = await initSocket(app, server, socketConf, 'tests')

  onExit(socket.Manager)
  app.locals.SocketManager = socket.Manager

  return { app, server, socket }
}

initApi()
