import type { OpenFileTreeEvent } from '@types'
import type { Dispatch, SetStateAction } from 'react'

import { useCallback } from 'react'
import { settingsModal } from '@actions/modals'
import { EE } from '@gobletqa/shared/libs/eventEmitter'
import { SideNav as SideNavConst } from '@constants/nav'
import { OpenFileTreeEvt, EditorSidebarWidth } from '@constants'

export type TNavItemClick = {
  navItem:string,
  activeNav:string|undefined,
  setOpen:Dispatch<SetStateAction<boolean>>,
  setActiveNav:Dispatch<SetStateAction<string | undefined>>,
}


const findNavItem = (element:HTMLElement):string|undefined => {
  const navItem = element?.dataset?.navItem
  if(navItem) return navItem

  const parent = element?.parentNode as HTMLElement

  return !parent || parent?.classList?.contains(SideNavConst.groupClassName || ``)
      ? undefined
      : findNavItem(parent as HTMLElement)
}

const onFilesClick = ({
  navItem,
  setOpen,
  activeNav,
  setActiveNav,
}:TNavItemClick) => {
  if(activeNav === `files`){
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


export const useSideNavToggle = (
  open:boolean,
  setOpen:Dispatch<SetStateAction<boolean>>,
  activeNav:string|undefined,
  setActiveNav:Dispatch<SetStateAction<string | undefined>>
) => {
  return useCallback((event:Record<string, any>) => {
    const updatedOpen = !open
    const navItem = findNavItem(event?.target as HTMLElement)

    if(navItem === `files`)
      return onFilesClick({ navItem, activeNav, setOpen, setActiveNav })

    if(navItem === `settings`)
      return settingsModal()

    if((!navItem || navItem === activeNav) && !updatedOpen){
      setOpen(updatedOpen)
      setActiveNav(undefined)
    }
    else {
      setOpen(true)
      setActiveNav(navItem)
    }

  }, [open, activeNav])

}
