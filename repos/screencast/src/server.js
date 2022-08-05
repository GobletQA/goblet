const apiEndpoints = require('@Endpoints')
const { validateUser } = require('./middleware')
const { getApp } = require('@gobletqa/shared/express/app')
const { isDeployedEnv } = require('@gobletqa/shared/utils/isDeployedEnv')
const {
  setupCors,
  setupServer,
  setupLoggerReq,
  setupLoggerErr,
  setupBlacklist,
  setupServerListen,
} = require('@gobletqa/shared/middleware')

/**
 * Starts a express API server for screencast
 * Loads the Goblet Config, which is used for configuring the server
 *
 * @returns {Object} - Express app, server and socket.io socket
 */
const initApi = async () => {
  const app = getApp()

  const { screencast } = app.locals.config

  setupLoggerReq(app)
  setupBlacklist(app)
  setupCors(app)
  setupServer(app)
  validateUser(app)
  apiEndpoints(app)
  setupLoggerErr(app)

  const {
    secureServer,
    insecureServer,
  } = setupServerListen(app, { name: `Screencast`, ...screencast.server })

  return { app, server: secureServer || insecureServer }
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