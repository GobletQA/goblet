import { queryToObj, objToQuery, noOpObj, noPropArr } from '@keg-hub/jsutils'
import { inPopStateUpdate } from './listenToPopState'
/**
 * Wrapper around window.location and window.history
 * Encapsulates the global APIs to ensure consistency
 * @function
 * @private
 *
 * @return {Object} - Contains the location and history global objects
 */
const getWindowProps = () => {
  return typeof window === 'undefined'
    ? noOpObj
    : (() => ({ location: window.location, history: window.history }))()
}

/**
 * Builds the new query to be the the browser url should be update to
 * @function
 * @private
 * @param {Object} current - The current query params of the browser url
 * @param {Object} update - New query params to be added to the url
 * @param {boolean} merge - Should the update be merged with the current query params
 *
 * @return {string} - Stringified version of the query params
 */
const buildQuery = (
  current:Record<string, string>,
  update:Record<string, string>,
  merge:boolean
) => {
  const query = merge ? { ...current, ...update } : update
  return objToQuery(query)
}

/**
 * Removes an array of items for the url query params
 * @function
 * @public
 * @export
 * @param {Array} toRemove - Array of items to remove form the query prams
 *
 * @return {void}
 */
export const removeFromQuery = (toRemove:string[]=noPropArr as string[]) => {
  const current = queryToObj(location.search)
  toRemove.map(item => (delete current[item]))

  history.pushState(noOpObj, '', objToQuery(current))
}

/**
 * Updates the browsers url query params without reloading the window
 * @function
 * @public
 * @export
 * @param {Object} update - New query params to be added to the url
 * @param {boolean} merge - Should the update be merged with the current query params
 *
 * @return {void}
 */
export const updateUrlQuery = (
  update:Record<string, string> = noOpObj as Record<string, string>,
  merge:boolean
) => {
  if (inPopStateUpdate()) return

  const { location, history } = getWindowProps() as { location: Record<any, any>, history:any }
  const current = queryToObj(location.search) as Record<any, any>

  history.pushState(noOpObj, '', buildQuery(current, update, merge))
}
