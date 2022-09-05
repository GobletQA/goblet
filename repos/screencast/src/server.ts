import { initSockr } from '@GSC/libs/sockr'
import { getApp } from '@gobletqa/shared/express/app'
import { screencastConfig } from '@GSC/Configs/screencast.config'
import { setupEndpoints, setupInactiveTimeout } from '@GSC/middleware'
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

  setupLoggerReq(app)
  setupBlacklist(app)
  setupCors(app)
  setupJWT(app, [])
  setupServer(app)
  validateUser(app, `/screencast\/*`)
  setupRepo(app)
  setupInactiveTimeout(app)
  await setupEndpoints()
  setupLoggerErr(app)

  const {
    secureServer,
    insecureServer,
  } = setupServerListen({
    app,
    config: {name: `Screencast`, ...app.locals.config.server}
  })

  const server = secureServer || insecureServer
  const socket = await initSockr(app, server, app?.locals?.config?.sockr, 'tests')

  return { app, server, socket }
}

process.on('SIGINT', () => {
  console.log(`[Screencast] Force Killing screencast server...`)
  process.exit()
})

initApi()