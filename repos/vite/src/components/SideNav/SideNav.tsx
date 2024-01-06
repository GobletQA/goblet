import type { CSSProperties } from 'react'
import type { TNavItemProps } from '../Nav/NavItem'
import type { TResizeSideBarEvent } from '@gobletqa/components'

import { useApp } from '@store'
import { ESideNav } from '@types'
import { navItemNameToTitle } from '@utils'
import { EE } from '@services/sharedService'
import { NavGroups, TGroupItem } from '../Nav'
import { HeaderSpacer, Drawer } from './SideNav.styled'
import { SideNav as SideNavItems } from '@constants/nav'
import { useSideNavToggle } from '@hooks/nav/useSideNavToggle'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import { useState, useEffect, useMemo, useCallback } from 'react'
import {
  useClickAway,
  ResizeSideBarEvent,
} from '@gobletqa/components'

const groups = SideNavItems.groups.map(group => {
  const builtGrp = { ...group, items: [] } as TGroupItem
  // @ts-ignore
  group.items.map(({ icon, hidden, title, name, ...item }) => {
    !hidden &&
      builtGrp.items.push({
        ...item,
        title,
        name: name || navItemNameToTitle(title)
      } as TNavItemProps)
  })

  return builtGrp
})

type TSideNavProps = {
  groups?: TGroupItem[]
  initialOpen?: boolean
}

export const SideNav = (props:TSideNavProps) => {
  const { sidebarLocked } = useApp()

  const [open, setOpen] = useState<boolean>(false)
  const [activeNav, setActiveNav] = useState<ESideNav|undefined>()

  const toggleOpen = useCallback((toggle:boolean, force?:boolean) => {
    if(sidebarLocked && open && !force) return

    if(sidebarLocked && force)
      EE.emit<TResizeSideBarEvent>(ResizeSideBarEvent, { toggle:true })

    setOpen(toggle)
  }, [sidebarLocked, open])

  const toggleDrawer = useSideNavToggle(
    open,
    toggleOpen,
    activeNav,
    setActiveNav
  )

  const onClickAway = useClickAway((open:boolean) => toggleOpen(open))

  const subNavSx = useMemo<CSSProperties>(() => {
    return activeNav === ESideNav.files && sidebarLocked
      ? { opacity: `0`, pointerEvents: `none` }
      : { opacity: `1` }
  }, [sidebarLocked, open, activeNav])

  useEffect(() => {
    activeNav === ESideNav.files
      && sidebarLocked
      && open
      && setOpen(false)
  }, [sidebarLocked, open, activeNav])

  return (
    <ClickAwayListener onClickAway={onClickAway} >
      <Drawer
        variant="permanent"
        className="side-nav-drawer"
        open={!sidebarLocked && open}
        sidebarLocked={sidebarLocked}
      >
        <HeaderSpacer />
        <NavGroups
          {...props}
          open={open}
          groups={groups}
          subNavSx={subNavSx}
          activeNav={activeNav}
          toggleDrawer={toggleDrawer}
          className={SideNavItems.groupClassName}
        />
      </Drawer>
    </ClickAwayListener>
  )
}
