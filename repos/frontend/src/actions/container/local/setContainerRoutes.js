import { setItems } from 'HKActions'
import { Values } from 'HKConstants'
import { noOpObj, toStr } from '@keg-hub/jsutils'
import { localStorage } from'HKUtils/storage/localStorage'

const { CATEGORIES, GB_SC_PORT } = Values


/**
 * Helper to throw an error if the routes are not configured properly
 */
const throwRoutesError = (routes, type) => {
  console.error(`Could not set ${type}, it does not exist on the routes object`)
  console.log(`Routes:`, routes)
  throw new Error(`Error setting container routes`)
}

/**
 * Action to store the session container meta data in the store
 * May also store it in local-storage, need to investigate
 * 
 */
export const setContainerRoutes = async (data=noOpObj) => {
  const { routes=noOpObj } = data
  if(!routes) return throwRoutesError(data, `session container routes`)

  const { api, screencast } = Object.entries(routes)
    .reduce((acc, [port, data]) => {
      toStr(port) === toStr(GB_SC_PORT)
        ? (acc.api = data)
        : (acc.screencast = data)

      return acc
    }, {})


  const scPort = screencast?.headers?.[`x-forwarded-port`]
  !scPort
    ? throwRoutesError(routes, `screencast url`)
    : await localStorage.setScPort(scPort)

  !api?.headers
    ? throwRoutesError(routes, `api route headers`)
    : await localStorage.setHeaders(api?.headers)

  setItems(CATEGORIES.ROUTES, routes)
  return routes
}