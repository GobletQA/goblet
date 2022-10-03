
import { containerDispatch } from '@store'
import { localStorage } from '@services/localStorage'


export const clearContainerRoutes = async (storage:boolean) => {
  containerDispatch.clear()
  if(!storage) return

  await localStorage.removeHeaders()
}