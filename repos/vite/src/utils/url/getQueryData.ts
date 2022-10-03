import { queryToObj, noOpObj } from '@keg-hub/jsutils'

type TQueryData = {
  file: string
  [Key: string]: any
}

/**
 * Gets the query params from the current url location
 * @function
 *
 * @returns {Object} query params as an object
 */
export const getQueryData = () => {
  return typeof document === 'undefined'
    ? noOpObj
    : queryToObj(document?.location?.search) as TQueryData
}
