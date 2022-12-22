import type { TNavItemClick, OpenFileTreeEvent } from '@types'

import { ESideNav } from '@types'
import { EE } from '@gobletqa/shared/libs/eventEmitter'
import { OpenFileTreeEvt, EditorSidebarWidth } from '@constants'


export const onFiles = ({
  name,
  setOpen,
  active,
  setActive,
}:TNavItemClick) => {
  if(active === ESideNav.Files){
    EE.emit<OpenFileTreeEvent>(OpenFileTreeEvt, { size: 0 })
    setActive(undefined)
  }
  else {
    EE.emit<OpenFileTreeEvent>(OpenFileTreeEvt, { size: EditorSidebarWidth })
    setActive(name)
  }

  setOpen(false)
  return
}