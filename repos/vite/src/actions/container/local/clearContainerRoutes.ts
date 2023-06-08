
import { containerDispatch } from '@store'
import { localStorage } from '@services/localStorage'


export const clearContainerRoutes = async (storage:boolean=true) => {

  containerDispatch.clearContainer()

  if(!storage) return

  await localStorage.removeHeaders()
}