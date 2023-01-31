import type { Express } from 'express'
import express from 'express'
import { noOpObj, deepMerge } from '@keg-hub/jsutils'
import { getDefaultGobletConfig } from '@GSH/goblet/getDefaultGobletConfig'

let _APP:Express

/**
 * Adds the goblet config to the app based on the type
 * @function
 * @public
 * @param {string} [type] - Property on the goblet config that contains the server config
 *
 * @returns {Object} - Express App Object
 */
const setupApp = (serverConf) => {
  !_APP.locals.config && (_APP.locals.config = deepMerge(getDefaultGobletConfig(), serverConf))

  return _APP
}

/**
 * Initializes an Express app if it does not already exist
 * @function
 * @public
 *
 * @returns {Object} - Express App Object
 */
export const getApp = (serverConf=noOpObj) => {
  !_APP && (_APP = express())

  return setupApp(serverConf)
}
