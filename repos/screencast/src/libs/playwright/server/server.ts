import type { TBrowserServer } from '@GSC/types'

import metadata from '../helpers/metadata'

/**
 * Cache holder for the launched playwright browser
 * @type {Object|undefined}
 */
let PW_SERVER:TBrowserServer

/**
 * Returns the cached playwright server
 * @function
 */
export const getServer = () => PW_SERVER

/**
 * Sets the cached playwright server
 * @function
 */
export const setServer = (server:TBrowserServer) => {
  PW_SERVER = server

  return PW_SERVER
}

/**
 * Gets the cached browser server metadata
 */
export const getMetadata = async (type:string) => {
  return await metadata.read(type)
}

