import type { Dispatch, SetStateAction } from 'react'
import type { TNavItem, TSideNavToggleProps } from '@types'

import { ESideNav } from '@types'
import { useCallback } from 'react'
import { navItemNameToTitle } from '@utils'
import { EE } from '@services/sharedService'
import { isFunc, exists } from '@keg-hub/jsutils'
import { useOnEvent } from '@gobletqa/components'
import { SideNav as SideNavItems } from '@constants/nav'
import { ToggleSideNavEvt, SideNavToggledEvt } from '@constants/events'
import { navToggleTestRunsView } from '@actions/testRuns/navToggleTestRunsView'

const sideNavToggled = (params:TSideNavToggleProps) => EE.emit<TSideNavToggleProps>(
  SideNavToggledEvt,
  params
)

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
    return found
      || group.items.find(item => name === navItemNameToTitle(item.name || item.title))
  }, undefined as TNavItem|undefined)

  return { item, name }
}

export const useSideNavToggle = (
  open:boolean,
  setOpen:(open:boolean, force?:boolean) => void,
  active:ESideNav|undefined,
  setActive:Dispatch<SetStateAction<ESideNav | undefined>>
) => {

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

    if(!navToggleTestRunsView()) return

    if((!name || name === active) && !nextOpen){
      setOpen(nextOpen, true)
      setActive(undefined)
      sideNavToggled({ open: nextOpen })
    }
    else {
      setOpen(true, true)
      setActive(name)
      sideNavToggled({ open: true, name })
    }

  }, [open, active])

}
