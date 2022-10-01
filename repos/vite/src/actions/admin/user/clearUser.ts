import { dispatch } from '@store'
import { StorageKeys, ActionTypes } from '@constants'
import { noOpObj } from '@keg-hub/jsutils'

/**
 * Creates a user in the store
 *
 */
export const clearUser = () => {
  dispatch({
    type: ActionTypes.SET_ITEMS,
    payload: {
      category: StorageKeys.USER,
      items: noOpObj,
    },
  })
}
