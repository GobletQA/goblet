const fs = require('fs')
const http = require('http')
const https = require('https')
const { getApp } = require('@GSH/App')
const { Logger } = require('@keg-hub/cli-utils')

/**
 * Adds a timer to force exiting the current process after a given time
 * Allow forcing the servers closed after a given time when an exit event is fired
 * @param {number} exitTimeout - Amount of time to wait until force exiting the process
 * @param {number} exitCode - Code relative to the type of exit event that fired
 *
 */
const addExitTimeout = (exitTimeout, exitCode=0) => {
  setTimeout(() => {
    Logger.info(`[Goblet] Server did not shutdown in time, force exiting the process!`)
    process.exit(exitCode)
  }, exitTimeout).unref()
}

/**
 * Adds exit listeners to allow graceful shutdown of the servers
 * @exits
 * @param {Object} insecureServer - Express server object
 * @param {Object} secureServer - Express server object
 * @param {number} exitTimeout - Amount of time to wait until force exiting the process
 *
 */
const addExitListener = (insecureServer, secureServer, exitTimeout=3000) => {
  let exitCalled
  ;([
    `SIGINT`,
    `SIGTERM`,
    `SIGUSR1`,
    `SIGUSR2`,
    `uncaughtException`,
  ]).map(type => {
    
    process.on(type, () => {
      if(exitCalled) return

      const exitCode = type === `uncaughtException` ? 1 : 0
      exitTimeout && addExitTimeout(exitTimeout, exitCode)

      let secureClosed
      let insecureClosed
      exitCalled = true
      Logger.info(`[Goblet] Server cleaning up...`)
      secureServer &&
        secureServer.close(() => {
          secureClosed = true
          Logger.success(`[Goblet] Finished cleaning up secure server!`)
          ;(!insecureServer || insecureClosed) && process.exit(exitCode)
        })

      insecureServer &&
        insecureServer.close(() => {
          insecureClosed = true
          Logger.success(`[Goblet] Finished cleaning up insecure server!`)
          ;(!secureServer || secureClosed) && process.exit(exitCode)
        })
      
      !secureServer && !insecureServer && process.exit(exitCode)
    })
  })
}

/**
 * Sets up a secure server, typically used for local development
 * @param {Object} app - Express app object
 * @param {Object} serverConf - Configuration for the server
 * @param {number} exitTimeout - Amount of time to wait until force exiting the process
 *
 * @returns {Object} - Insecure / Secure server object and Express app object
 */
const serverListen = (app, serverConf, exitListener=true, exitTimeout) => {
  const { securePort, port, host, name } = serverConf
  const creds = {
    key: process.env.GB_SSL_KEY,
    cert: process.env.GB_SSL_CERT,
    ca: process.env.GB_SSL_CA,
  }

  const credentials = Object.entries(creds).reduce((conf, [key, loc]) => {
    fs.existsSync(loc) && (conf[key] = fs.readFileSync(loc, 'utf8'))

    return conf
  }, {})

  const httpServer = http.createServer(app)
  const httpsServer = credentials.cert &&
    credentials.key &&
    https.createServer(credentials, app)

  const serverTag = `[Goblet ${name || 'Server'}]`
  const insecureServer = httpServer.listen(port, () => {
    Logger.empty()
    Logger.pair(`${serverTag} Insecure Server running on: `, `http://${host}:${port}`)
    Logger.empty()
  })

  const secureServer = httpsServer &&
    httpsServer.listen(securePort, () => {
      Logger.empty()
      Logger.pair(`${serverTag} Secure Server running on: `, `https://${host}:443`)
      Logger.empty()
    })

  ;(serverConf.exitListener || exitListener) &&
    addExitListener(
      insecureServer,
      secureServer,
      exitTimeout || serverConf.exitTimeout
    )

  return { insecureServer, secureServer, app }
}


/**
 * Sets up a server based on config settings
 * @param {Object} app - Express app to create the server from
 * @param {Object} config - Goblet Server config
 * @param {boolean} exitListen - Add exit listener to the servers
 * @param {number} exitTimeout - Amount of time to wait until force exiting the process
 *
 * @returns {Object} - Response from server setup method
 */
const setupServerListen = (app, config, exitListener, exitTimeout) => {
  return serverListen(app || getApp(), config, exitListener, exitTimeout)
}

module.exports = {
  setupServerListen
}