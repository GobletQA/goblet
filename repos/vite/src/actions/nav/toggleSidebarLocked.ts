import type { TResizeSideBarEvent } from '@gobletqa/components'

import { exists } from '@keg-hub/jsutils'
import { EE } from '@services/sharedService'
import { appDispatch, getStore } from '@store'
import { ResizeSideBarEvent, SidebarOpenWidth } from '@gobletqa/components'

export const toggleSidebarLocked = (lock?:boolean) => {
  const { app } = getStore().getState()
  const { sidebarLocked } = app

  const locked = exists(lock) ? lock : !sidebarLocked

  // Always reset the sidebar width any time it is locked or unlocked
  EE.emit<TResizeSideBarEvent>(ResizeSideBarEvent, { size: SidebarOpenWidth })

  appDispatch.toggleSidebarLocked(locked)
}