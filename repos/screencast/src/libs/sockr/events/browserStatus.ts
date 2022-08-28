import type { Express, Request } from 'express'
import { Logger } from '@keg-hub/cli-utils'
import { get, noOpObj } from '@keg-hub/jsutils'
import { statusBrowser } from '@GSC/libs/playwright/browser/statusBrowser'

let prevStatus
let watchInterval:ReturnType<typeof setTimeout>
const defMessage = noOpObj as Record<any, any>

/**
 * Calls the statusBrowser to get the status of the browser
 * @function
 * @param {Object} browserConf - Config options for checking the browser status
 * @param {Object} Manager - Sockr Manager Instance
 *
 * @returns {void}
 */
const getStatusUpdate = async (
  browserConf:Record<any, any>,
  Mgr:Record<any, any>
) => {
  
  const status = await statusBrowser(browserConf)
  // If no status chance, don't update the backend
  if (prevStatus === status?.status) return

  prevStatus = status?.status
  Mgr.emitAll(`browserStatus`, { data: status })
}

/**
 * Uses setInterval to loop call the status update method
 * Interval method runs every 5 seconds unless overridden by passed in options
 * @function
 * @param {Object} app - Express App object
 * @param {Object} options - Options for watching the browser
 * @param {Object} Manager - Sockr Manager Instance
 *
 * @returns {function} - setInterval response for clearing the interval
 */
const startWatching = (
  app:Express,
  options:Record<any, any>,
  Manager:Record<any, any>
) => {
  const browserConf = get(app, 'locals.config.screencast.browser', noOpObj)

  return setInterval(
    async (bConf, Mgr) => {
      return await getStatusUpdate(bConf, Mgr).catch(err =>
        Logger.error(err.message)
      )
    },
    options.interval || 5000,
    { ...browserConf, ...options },
    Manager
  )
}

/**
 * Helper to watch the Playwright browser status
 * Checks if it should start watching the browser, and calls the watching if needed
 * Allows passing a `stopWatching` to stop the loop check
 * @function
 * @param {Object} app - Express App object
 *
 * @returns {function} - Custom Event Method passed to Sockr to be called from the frontend
 */
export const browserStatus = (app:Express) => {
  return ({
    Manager,
    message = defMessage,
  }) => {
    if (message?.stopWatching) {
      watchInterval && clearInterval(watchInterval)
      return (watchInterval = undefined)
    }

    watchInterval = startWatching(app, message, Manager)
  }
}