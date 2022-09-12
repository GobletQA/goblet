import { dispatch } from 'GBStore'
import { Values, ActionTypes } from 'GBConstants'

const { CATEGORIES } = Values

/**
 * Removes the key item from pendingFiles store
 * @param {Object} activeFile - The currently active file of the active screen
 */
export const removePendingFile = activeFile => {
  dispatch({
    type: ActionTypes.REMOVE_ITEM,
    payload: {
      category: CATEGORIES.PENDING_FILES,
      key: activeFile.location,
    },
  })
}
