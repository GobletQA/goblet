import type { Express } from 'express'

import fs from 'fs'
import http from 'http'
import https from 'https'
import { getApp } from '@GSH/express/app'
import { ApiLogger as Logger } from '@gobletqa/logger'
import {findProc} from '@GSH/libs/proc'

type TCredentials = {
  ca?: string
  key?: string
  cert?: string
}

type TServerListen = {
  app:Express,
  config:Record<any, any>
}

// TODO investigate this
// Enable keepalive globally for https servers
// http.globalAgent = new http.Agent({ keepAlive:true })
// https.globalAgent = new https.Agent({ keepAlive:true })
// server.keepAliveTimeout = 30000; 


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
) => {
  try {
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

    return { insecureServer, secureServer, app }
  }
  catch(err){
    // if(err.message.includes(`EADDRINUSE`)){
    //   findProc(`screencast`)
    // }
    
    console.log(`err.name`, err.name)
    console.log(`err.code`, err.code)
    console.log(`err.message`, err.message)
    throw err
    // Error: listen EADDRINUSE
  }
}


/**
 * Sets up a server based on config settings
 */
export const setupServerListen = ({
  app,
  config
}: TServerListen) => {
  return serverListen(
    app || getApp(),
    config,
  )
}
