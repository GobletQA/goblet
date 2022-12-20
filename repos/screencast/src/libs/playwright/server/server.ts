import type { EBrowserName, TBrowserServer } from '@GSC/types'

/**
 * Cache holder for the launched playwright browser
 * @type {Object|undefined}
 */
let PW_SERVER:Record<EBrowserName, TBrowserServer>

/**
 * Returns the cached playwright server
 * @function
 */
export const getServer = (type:EBrowserName) => {
  return PW_SERVER[type]
}

/**
 * Clears the server cache
 * @function
 */
export const clearServer = (type:EBrowserName) => {
  PW_SERVER[type] = undefined
  delete PW_SERVER[type]
}

/**
 * Sets the cached playwright server
 * @function
 */
export const setServer = (type:EBrowserName, server:TBrowserServer) => {
  PW_SERVER[type] = server

  return PW_SERVER[type]
}

export const clearAllServers = () => {
  PW_SERVER = undefined
}
