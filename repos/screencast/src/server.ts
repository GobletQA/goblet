import { initSockr } from '@GSC/libs/sockr'
import { setupEndpoints } from '@GSC/middleware'
import { getApp } from '@gobletqa/shared/express/app'
import { screencastConfig } from '@GSC/Configs/screencast.config'
import { isDeployedEnv } from '@gobletqa/shared/utils/isDeployedEnv'
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
  await setupEndpoints()
  setupLoggerErr(app)

  const {
    secureServer,
    insecureServer,
  } = setupServerListen(app, {
    name: `Screencast`,
    ...app.locals.config.server
  })

  const server = secureServer || insecureServer
  const socket = await initSockr(app, server, app?.locals?.config?.sockr, 'tests')

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


process.on('SIGINT', () => {
  console.log(`[Screencast] Force Killing screencast server...`)
  process.exit()
})

initApi()