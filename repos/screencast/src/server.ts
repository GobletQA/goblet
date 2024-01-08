import '@GSC/utils/logger'
import {
  getApp,
  setupJWT,
  setupCors,
  validateUser,
  setupLoggerReq,
  setupLoggerErr,
  setupRateLimit,
  setupServerListen,
} from '@gobletqa/shared/api'
import {
  setupRouter,
  setupServer,
  setupBrowser,
  setupOnReqEnd,
  setupEndpoints
} from '@GSC/middleware'
import { onExit } from '@GSC/utils/onExit'
import { initSocket } from '@GSC/libs/websocket'
import { setupRepo } from '@GSC/middleware/setupRepo'
import { screencastConfig } from '@GSC/configs/screencast.config'
import { SCAuthBypassRoutes } from '@gobletqa/environment/constants'


/**
 * Starts a express API server for screencast
 * Loads the Goblet Config, which is used for configuring the server
 *
 * @returns {Object} - Express app, server and socket.io socket
 */
const initApi = async () => {

  const app = getApp(screencastConfig)

  setupBrowser(app)
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
  setupOnReqEnd()
  setupEndpoints()
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
  const socket = await initSocket(app, server, socketConf)

  onExit(socket.Manager)
  app.locals.SocketManager = socket.Manager

  return { app, server, socket }
}

initApi()
