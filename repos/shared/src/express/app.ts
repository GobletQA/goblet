import type { Express } from 'express'
import express from 'express'
import { noOpObj, deepMerge } from '@keg-hub/jsutils'
import { getGobletConfig, resetGobletConfig } from '@GSH/utils/getGobletConfig'

let _APP:Express

/**
 * Reloads the goblet config be deleting the current config and calling getGobletConfig
 * Does not reset the _CONFIG_TYPE, so the same type is loaded every time
 * @function
 * @public
 * @param {string} [type] - Property on the goblet config that contains the server config
 *
 * @returns {void}
 */
export const reloadGobletConfig = (serverConf:Record<any, any> = noOpObj) => {
  // Remove the old config
  resetGobletConfig()
  delete _APP.locals.config

  // Reload the app with the config
  setupApp(serverConf)
}

/**
 * Adds the goblet config to the app based on the type
 * @function
 * @public
 * @param {string} [type] - Property on the goblet config that contains the server config
 *
 * @returns {Object} - Express App Object
 */
const setupApp = (serverConf) => {
  !_APP.locals.config && (_APP.locals.config = deepMerge(getGobletConfig(), serverConf))

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
