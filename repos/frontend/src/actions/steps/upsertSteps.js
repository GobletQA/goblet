import { Values, ActionTypes } from 'GBConstants'
import { dispatch } from 'GBStore'
const { CATEGORIES } = Values

export const upsertSteps = steps => {
  steps &&
    dispatch({
      type: ActionTypes.UPSERT_ITEMS,
      payload: {
        category: CATEGORIES.STEPS,
        items: steps,
      },
    })
}
