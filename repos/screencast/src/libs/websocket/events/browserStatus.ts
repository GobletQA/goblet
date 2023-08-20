import type { Express } from 'express'
import type { TBrowserConf, SocketManager, TSocketEvtCBProps } from '@GSC/types'

import { Logger } from '@GSC/utils/logger'
import { get } from '@keg-hub/jsutils/get'
import { GBrowser } from '@gobletqa/browser'
import { noOpObj } from '@keg-hub/jsutils/noOpObj'
import { joinBrowserConf } from '@gobletqa/shared/utils/joinBrowserConf'

let prevStatus
let watchInterval:ReturnType<typeof setTimeout>


type TWatchOpts = Partial<TBrowserConf> & { interval?:number }

const defMessage = noOpObj as TWatchOpts

/**
 * Calls the startBrowser to get the status of the browser
 * @function
 * @param {Object} browserConf - Config options for checking the browser status
 * @param {Object} Manager - Socket Manager Instance
 *
 * @returns {void}
 */
const getStatusUpdate = async (
  browserConf:TBrowserConf,
  Mgr:SocketManager
) => {
  
  // TODO: Need to load the gobletConfig and pass it in here
  const status = await GBrowser.start({ browserConf: joinBrowserConf(browserConf) })
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
 * @param {Object} Manager - Socket Manager Instance
 *
 * @returns {function} - setInterval response for clearing the interval
 */
const startWatching = (
  app:Express,
  options:TWatchOpts,
  Manager:SocketManager
) => {
  const browserConf = get(app, 'locals.config.screencast.browser', noOpObj)
  const { interval, ...opts } = options

  return setInterval(
    async (bConf, Mgr) => {
      return await getStatusUpdate(bConf, Mgr).catch(err =>
        Logger.error(err.message)
      )
    },
    interval || 5000,
    { ...browserConf, ...opts } as TBrowserConf,
    Manager
  )
}

/**
 * Helper to watch the Playwright browser status
 * Checks if it should start watching the browser, and calls the watching if needed
 * Allows passing a `stopWatching` to stop the loop check
 * @function
 */
export const browserStatus = (app:Express) => {
  return ({
    Manager,
    data = defMessage,
  }:TSocketEvtCBProps) => {
    if (data?.stopWatching) {
      watchInterval && clearInterval(watchInterval)
      return (watchInterval = undefined)
    }

    watchInterval = startWatching(app, data, Manager)
  }
}