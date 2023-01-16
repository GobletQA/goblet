import '@GSC/utils/logger'
import { initSocket } from '@GSC/libs/websocket'
import { AUTH_BYPASS_ROUTES } from '@GSC/constants'
import { getApp } from '@gobletqa/shared/express/app'
import { setupEndpoints, setupTail } from '@GSC/middleware'
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
import { setupRepo } from '@gobletqa/shared/middleware/setupRepo'


/**
 * Starts a express API server for screencast
 * Loads the Goblet Config, which is used for configuring the server
 *
 * @returns {Object} - Express app, server and socket.io socket
 */
const initApi = async () => {
 
  const app = getApp(screencastConfig)

  setupTail(app)
  setupLoggerReq(app)
  setupBlacklist(app)
  setupCors(app)
  setupJWT(app, AUTH_BYPASS_ROUTES)
  setupServer(app)
  validateUser({
    route: `/screencast\/*`,
    bypassRoutes: AUTH_BYPASS_ROUTES
  })
  setupRepo(app)
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

  return { app, server, socket }
}

process.on('SIGINT', () => {
  console.log(`[Screencast] Force Killing screencast server...`)
  process.exit()
})

initApi()
