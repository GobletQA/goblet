import type { TNavItemClick } from '@types'
import type { TResizeSideBarEvent } from '@gobletqa/components'

import { ESideNav } from '@types'
import { EE } from '@gobletqa/shared/libs/eventEmitter'
import { ResizeSideBarEvent, DefSidebarWidth } from '@gobletqa/components'


export const onFiles = ({
  name,
  setOpen,
  active,
  setActive,
}:TNavItemClick) => {
  if(active === ESideNav.Files){
    EE.emit<TResizeSideBarEvent>(ResizeSideBarEvent, { size: 0 })
    setActive(undefined)
  }
  else {
    EE.emit<TResizeSideBarEvent>(ResizeSideBarEvent, { size: DefSidebarWidth })
    setActive(name)
  }

  setOpen(false)
  return
}