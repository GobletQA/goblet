import metadata from '../helpers/metadata'

/**
 * Cache holder for the launched playwright browser
 * @type {Object|undefined}
 */
let PW_SERVER

/**
 * Returns the cached playwrite server
 * @function
 */
export const getServer = () => PW_SERVER

/**
 * Sets the cached playwrite server
 * @function
 */
export const setServer = server => {
  PW_SERVER = server

  return PW_SERVER
}

/**
 * Gets the cached browser server metadata
 */
export const getMetadata = async type => {
  return await metadata.read(type)
}

