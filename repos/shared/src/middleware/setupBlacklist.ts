import type { Express } from 'express'

import fs from 'fs'
import path from 'path'
import { getApp } from '@GSH/express/app'
import blacklist from 'express-blacklist'
import expressDefend from 'express-defend'
import { noOp } from '@keg-hub/jsutils/noOp'
import { aliases } from '@GConfigs/aliases.config'

/** Path to the logs directory */
const logDir = aliases[`@GLogs`]

/**
* Overwrite the default to allow passing a callback to fs.appendFile
* Which fixes an error in the express-defend repo
*/
expressDefend.fileAppender = (logFile:string, message:string) => fs.appendFile(logFile, message, noOp)

/** Ensure the logs directory exists */
if(!process.env.EXAM_ENV)
  !fs.existsSync(logDir) && fs.mkdirSync(logDir)


/**
 * Sets up IP blocking via a blacklist
 * Attempts to track suspicious activity and then block that IP from access
 */
export const setupBlacklist = (app:Express) => {
  app = app || getApp()

  app.use(blacklist.blockRequests(path.join(logDir, `blacklist.txt`)))

  app.use(expressDefend.protect({
    maxAttempts: 5,
    dropSuspiciousRequest: true,
    logFile: path.join(logDir, `suspicious.log`),
    onMaxAttemptsReached: (ipAddress, url) => {
      console.log(`Adding IP Address to blacklist:`, ipAddress)
      blacklist.addAddress(ipAddress)
    }
  }))

}
