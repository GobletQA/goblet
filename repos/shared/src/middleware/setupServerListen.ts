import type { Express } from 'express'

import fs from 'fs'
import http from 'http'
import https from 'https'
import { getApp } from '@GSH/express/app'
import { Logger } from '@keg-hub/cli-utils'

type TCredentials = {
  ca?: string
  key?: string
  cert?: string
}

type TUncaughtExpCB = (exitCode:number, err:Error) => boolean

type TServerListen = {
  app:Express,
  config:Record<any, any>,
  exitListener?:boolean,
  exitTimeout?:number,
  uncaughtExpCB?:TUncaughtExpCB,
}

/**
 * Adds a timer to force exiting the current process after a given time
 * Allow forcing the servers closed after a given time when an exit event is fired
 * @param {number} exitTimeout - Amount of time to wait until force exiting the process
 * @param {number} exitCode - Code relative to the type of exit event that fired
 *
 */
const addExitTimeout = (exitTimeout:number, exitCode:number=0) => {
  return setTimeout(() => {
    process.exit(exitCode)
  }, exitTimeout)
}

/**
 * Def method used if uncaughtExpCB is not passed in
 */
const handleUncaughtExp = (exitCode:number=0, err:Error) => false


// handleUncaughtException
/**
 * Adds exit listeners to allow graceful shutdown of the servers
 * @exits
 * @param {Object} insecureServer - Express server object
 * @param {Object} secureServer - Express server object
 * @param {number} exitTimeout - Amount of time to wait until force exiting the process
 *
 */
const addExitListener = (
  insecureServer:http.Server,
  secureServer:https.Server,
  exitTimeout:number=3000,
  uncaughtExpCB:TUncaughtExpCB=handleUncaughtExp
) => {
  let exitCalled:boolean

  ;([
    `SIGINT`,
    `SIGTERM`,
    `SIGUSR1`,
    `SIGUSR2`,
    `uncaughtException`,
  ]).map(type => {
    
    process.on(type, (err:Error) => {
      const exitCode = type === `uncaughtException` ? 1 : 0

      if(uncaughtExpCB(exitCode, err)) return

      if(exitCalled) return

      const timeout = exitTimeout && addExitTimeout(exitTimeout, exitCode)
      timeout.unref()

      let secureClosed
      let insecureClosed
      exitCalled = true
      Logger.info(`[Goblet] Server cleaning up...`)

      secureServer &&
        secureServer.close(() => {
          secureClosed = true
          Logger.success(`[Goblet] Finished cleaning up secure server!`)
          if(insecureServer && !insecureClosed) return

          timeout && clearTimeout(timeout)
          process.exit(exitCode)
        })

      insecureServer &&
        insecureServer.close(() => {
          insecureClosed = true
          Logger.success(`[Goblet] Finished cleaning up insecure server!`)
          if(secureServer && !secureClosed) return

          timeout && clearTimeout(timeout)
          process.exit(exitCode)
        })

      if((!secureServer && !insecureServer) || (insecureClosed && secureClosed))
        process.exit(exitCode)

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
const serverListen = (
  app:Express,
  serverConf:Record<any, any>,
  exitListener:boolean=true,
  exitTimeout?:number,
  uncaughtExpCB?:TUncaughtExpCB,
) => {
  const { securePort, port, host, name } = serverConf
  const creds = {
    key: process.env.GB_SSL_KEY,
    cert: process.env.GB_SSL_CERT,
    ca: process.env.GB_SSL_CA,
  }

  const credentials = Object.entries(creds).reduce((conf, [key, loc]) => {
    fs.existsSync(loc) && (conf[key] = fs.readFileSync(loc, 'utf8'))

    return conf
  }, {} as TCredentials)

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
      exitTimeout || serverConf.exitTimeout,
      uncaughtExpCB
    )

  return { insecureServer, secureServer, app }
}


/**
 * Sets up a server based on config settings
 */
export const setupServerListen = ({
  app,
  config,
  exitListener,
  exitTimeout,
  uncaughtExpCB=handleUncaughtExp,
}: TServerListen) => {
  return serverListen(
    app || getApp(),
    config,
    exitListener,
    exitTimeout,
    uncaughtExpCB,
  )
}
