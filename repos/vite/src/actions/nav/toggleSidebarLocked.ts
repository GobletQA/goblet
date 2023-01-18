import { appDispatch, getStore } from '@store'
import { exists } from '@keg-hub/jsutils'

export const toggleSidebarLocked = (lock?:boolean) => {
  const { app } = getStore().getState()
  const { sidebarLocked } = app

  const locked = exists(lock) ? lock : !sidebarLocked
  appDispatch.toggleSidebarLocked(locked)
}