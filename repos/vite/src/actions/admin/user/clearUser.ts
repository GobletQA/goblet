import { dispatch } from '@store'
import { STORAGE, ActionTypes } from '@constants'
import { noOpObj } from '@keg-hub/jsutils'

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
