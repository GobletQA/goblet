import { dispatch } from '@store'
import { addToast } from '@actions/toasts'
import { STORAGE, ActionTypes } from '@constants'


/**
 * Creates a user in the store
 *
 */
export const upsertUser = async user => {
  if (!user)
    return addToast({
      type: 'error',
      message: `Can not add user to store. User does not exist`,
    })

  dispatch({
    type: ActionTypes.UPSERT_ITEMS,
    payload: {
      category: STORAGE.USER,
      items: user,
    },
  })
}
