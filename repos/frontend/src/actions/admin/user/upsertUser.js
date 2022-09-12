import { dispatch } from 'GBStore'
import { addToast } from 'GBActions/toasts'
import { Values, ActionTypes } from 'GBConstants'

const { STORAGE } = Values

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
