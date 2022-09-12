import { dispatch } from 'GBStore'
import { Values } from 'GBConstants'
import { ActionTypes } from 'GBConstants'

const { CATEGORIES } = Values
/**
 * updates the current active modal visibility
 */
export const setModalVisibility = visible => {
  dispatch({
    type: ActionTypes.SET_ITEM,
    payload: {
      category: CATEGORIES.MODALS,
      key: 'visible',
      item: visible,
    },
  })
}
