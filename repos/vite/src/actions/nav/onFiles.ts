import type { TNavItemClick, OpenFileTreeEvent } from '@types'

import { ESideNav } from '@types'
import { EE } from '@gobletqa/shared/libs/eventEmitter'
import { OpenFileTreeEvt, EditorSidebarWidth } from '@constants'


export const onFiles = ({
  navItem,
  setOpen,
  activeNav,
  setActiveNav,
}:TNavItemClick) => {
  if(activeNav === ESideNav.Files){
    EE.emit<OpenFileTreeEvent>(OpenFileTreeEvt, { size: 0 })
    setActiveNav(undefined)
  }
  else {
    EE.emit<OpenFileTreeEvent>(OpenFileTreeEvt, { size: EditorSidebarWidth })
    setActiveNav(navItem)
  }

  setOpen(false)
  return
}