import { dispatch } from 'GBStore'
import { Values, ActionTypes } from 'GBConstants'
import { noOpObj } from '@keg-hub/jsutils'

const { STORAGE } = Values

/**
 * Creates a user in the store
 *
 */
export const clearUser = () => {
  dispatch({
    type: ActionTypes.SET_ITEMS,
    payload: {
      category: STORAGE.USER,
      items: noOpObj,
    },
  })
}
