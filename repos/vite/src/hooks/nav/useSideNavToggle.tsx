import type { Dispatch, SetStateAction } from 'react'
import type { TNavItem, TSideNavToggleProps } from '@types'

import { ESideNav } from '@types'
import { useCallback } from 'react'
import { navItemNameToTitle } from '@utils'
import { isFunc, exists } from '@keg-hub/jsutils'
import { SideNav as SideNavItems } from '@constants/nav'
import { useOnEvent, useEventEmit } from '@gobletqa/components'
import { ToggleSideNavEvt, SideNavToggledEvt } from '@constants/events'

export const findNavItemName = (element:HTMLElement):ESideNav|undefined => {
  const navItem = element?.dataset?.navItem as ESideNav
  if(navItem) return navItem

  const parent = element?.parentNode as HTMLElement

  return !parent || parent?.classList?.contains(SideNavItems.groupClassName || ``)
      ? undefined
      : findNavItemName(parent as HTMLElement)
}

const findNavItem = (element:HTMLElement) => {
  const name = findNavItemName(element)

  const item = SideNavItems.groups.reduce((found, group) => {
    return found || group.items.find(item => name === navItemNameToTitle(item.name || item.title))
  }, undefined as TNavItem|undefined)

  return { item, name }
}

export const useSideNavToggle = (
  open:boolean,
  setOpen:(open:boolean, force?:boolean) => void,
  active:ESideNav|undefined,
  setActive:Dispatch<SetStateAction<ESideNav | undefined>>
) => {

  const sideNavToggled = useEventEmit(SideNavToggledEvt)

  useOnEvent<TSideNavToggleProps>(ToggleSideNavEvt, ({ open, name, force }) => {
    const nextOpen = exists(open) ? open as boolean : true
    setOpen(nextOpen, force)
    exists<ESideNav>(name) && setActive(name)
    sideNavToggled({ open: nextOpen, name })
  })

  return useCallback((event:Record<string, any>) => {
    const nextOpen = !open
    const { item, name } = findNavItem(event?.target as HTMLElement)

    if(isFunc(item?.action))
      return item?.action?.({
        name,
        active,
        setOpen,
        setActive,
      })

    if((!name || name === active) && !nextOpen){
      setOpen(nextOpen, true)
      setActive(undefined)
      sideNavToggled({ open: nextOpen })
    }
    else {
      setOpen(true, true)
      setActive(name)
      sideNavToggled({ open: true, active: name })
    }

  }, [open, active])

}
