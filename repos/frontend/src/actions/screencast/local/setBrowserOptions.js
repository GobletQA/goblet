import { dispatch, getStore } from 'GBStore'
import { Values, ActionTypes } from 'GBConstants'
import { addToast } from '../../toasts/addToast'
import { noOpObj } from '@keg-hub/jsutils'

const { CATEGORIES } = Values

export const setBrowserOptions = (options = noOpObj) => {
  dispatch({
    type: ActionTypes.UPSERT_ITEMS,
    payload: {
      category: CATEGORIES.BROWSER_OPTS,
      items: options,
    },
  })
}
