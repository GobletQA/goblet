import { setItems } from 'HKActions'
import { Values } from 'HKConstants'
import { noOpObj } from '@keg-hub/jsutils'

const { CATEGORIES } = Values


/**
 * Action to store the session container meta data in the store
 * May also store it in local-storage, need to investigate
 * 
 */
export const setContainerRoutes = ({ routes }=noOpObj) => {
  routes && setItems(CATEGORIES.ROUTES, routes)
  return routes
}