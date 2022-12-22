import type { Dispatch, SetStateAction } from 'react'

import { ESideNav } from '@types'
import { useCallback } from 'react'
import { SideNav as SideNavConst } from '@constants/nav'


export const findNavItem = (element:HTMLElement):ESideNav|undefined => {
  const navItem = element?.dataset?.navItem as ESideNav
  if(navItem) return navItem

  const parent = element?.parentNode as HTMLElement

  return !parent || parent?.classList?.contains(SideNavConst.groupClassName || ``)
      ? undefined
      : findNavItem(parent as HTMLElement)
}



export const useSideNavToggle = (
  open:boolean,
  setOpen:Dispatch<SetStateAction<boolean>>,
  activeNav:ESideNav|undefined,
  setActiveNav:Dispatch<SetStateAction<ESideNav | undefined>>
) => {
  return useCallback((event:Record<string, any>) => {
    const updatedOpen = !open
    const navItem = findNavItem(event?.target as HTMLElement)

    if(navItem === ESideNav.Files){
      return
    }

    if(navItem === ESideNav.Settings){
      return
    }

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
