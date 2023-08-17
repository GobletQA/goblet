import '@GSC/utils/logger'
import { onExit } from '@GSC/utils/onExit'
import { initSocket } from '@GSC/libs/websocket'
import { SCAuthBypassRoutes } from '@GSC/constants'
import { setupRepo } from '@GSC/middleware/setupRepo'
import { getApp } from '@gobletqa/shared/express/app'

import { setupBrowser, setupEndpoints } from '@GSC/middleware'
import { screencastConfig } from '@GSC/Configs/screencast.config'
import {
  setupJWT,
  setupCors,
  setupServer,
  setupLoggerReq,
  setupLoggerErr,
  setupBlacklist,
  setupServerListen,
  validateUser,
} from '@gobletqa/shared/middleware'

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
  setupBlacklist(app)
  setupCors(app)
  setupJWT(app, SCAuthBypassRoutes)
  setupServer(app)
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

  return { app, server, socket }
}

initApi()
