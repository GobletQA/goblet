import { Values, ActionTypes } from 'GBConstants'
import { dispatch, getStore } from 'GBStore'
const { CATEGORIES } = Values

export const removeToast = toast => {
  const { items } = getStore().getState()
  const toasts = items[CATEGORIES.TOASTS]

  if (!toasts.includes(toast)) return

  const updated = toasts.filter(item => item.id !== toast.id)

  updated &&
    dispatch({
      type: ActionTypes.SET_ITEMS,
      payload: {
        category: CATEGORIES.TOASTS,
        items: updated,
      },
    })
}
