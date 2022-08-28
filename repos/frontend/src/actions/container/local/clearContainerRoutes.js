import { setItems } from 'HKActions'
import { Values } from 'HKConstants'
import { localStorage } from'HKUtils/storage/localStorage'

const { CATEGORIES } = Values

export const clearContainerRoutes = async (storage=true) => {
  setItems(CATEGORIES.ROUTES, {})
  if(!storage) return

  await localStorage.removeScPort()
  await localStorage.removeHeaders()
}