import { setItems } from 'HKActions'
import { Values } from 'HKConstants'
import { noOpObj } from '@keg-hub/jsutils'
import { localStorage } from'HKUtils/storage/localStorage'

const { CATEGORIES, GB_SC_PORT } = Values


/**
 * Action to store the session container meta data in the store
 * May also store it in local-storage, need to investigate
 * 
 */
export const setContainerRoutes = async ({ routes }=noOpObj) => {
  if(!routes) throw new Error(`Could not set session container routes, they do not exist`)
  
  const routeHeaders = routes?.[GB_SC_PORT]?.headers
  if(!routeHeaders)  throw new Error(`Could not set routes headers, they do not exist`)

  await localStorage.setHeaders(routeHeaders)
  setItems(CATEGORIES.ROUTES, routes)
  return routes
}