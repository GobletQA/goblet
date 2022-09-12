import { setItems } from 'GBActions'
import { Values } from 'GBConstants'
import { localStorage } from 'GBUtils/storage/localStorage'

const { CATEGORIES } = Values

export const clearContainerRoutes = async (storage=true) => {
  setItems(CATEGORIES.ROUTES, {})
  if(!storage) return

  await localStorage.removeHeaders()
}