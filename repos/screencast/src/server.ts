import { initSockr } from '@GSC/libs/sockr'
import { socketInit } from '@GSC/libs/websocket'

// @ts-ignore
import { AUTH_BYPASS_ROUTES } from '@GSC/constants'
import { getApp } from '@gobletqa/shared/express/app'
import { screencastConfig } from '@GSC/Configs/screencast.config'
import { setupEndpoints } from '@GSC/middleware'
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
  setupJWT(app, AUTH_BYPASS_ROUTES)
  setupServer(app)
  validateUser(app, `/screencast\/*`)
  setupRepo(app)
  await setupEndpoints()
  setupLoggerErr(app)

  const {
    secureServer,
    insecureServer,
  } = setupServerListen({
    app,
    config: {name: `Screencast`, ...app.locals.config.server}
  })

  const sockrConf = app?.locals?.config?.sockr
  const server = secureServer || insecureServer
  const socket = await socketInit(app, server, sockrConf, 'tests')

  return { app, server, socket }
}

process.on('SIGINT', () => {
  console.log(`[Screencast] Force Killing screencast server...`)
  process.exit()
})

initApi()
