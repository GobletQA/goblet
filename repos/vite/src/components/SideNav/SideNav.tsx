import type { TNavItemProps } from '../Nav/NavItem'

import { useApp } from '@store'
import { useState, useEffect, useMemo } from 'react'
import { ESideNav } from '@types'
import { navItemNameToTitle } from '@utils'
import { NavGroups, TGroupItem } from '../Nav'
import { HeaderSpacer, Drawer } from './SideNav.styled'
import { SideNav as SideNavItems } from '@constants/nav'
import ClickAwayListener from '@mui/base/ClickAwayListener'
import { useSideNavToggle } from '@hooks/nav/useSideNavToggle'
import { useClickAway, useInline } from '@gobletqa/components'
import { toggleSidebarLocked } from '@actions/nav/toggleSidebarLocked'

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
  const [open, setOpen] = useState(false)
  const [activeNav, setActiveNav] = useState<ESideNav|undefined>()

  const toggleOpen = useInline((toggle:boolean, force?:boolean) => {
    if(sidebarLocked && open && !force) return
    setOpen(toggle)
  })

  const toggleDrawer = useSideNavToggle(
    open,
    toggleOpen,
    activeNav,
    setActiveNav
  )

  const onClickAway = useClickAway((open:boolean) => toggleOpen(open))
  
  const subNavSx = useMemo(() => {
    return activeNav === ESideNav.files && sidebarLocked
      ? { display: `none` }
      : {}
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
        open={open}
        variant="permanent"
        className="side-nav-drawer"
      >
        <HeaderSpacer />
        <NavGroups
          {...props}
          open={open}
          groups={groups}
          subNavSx={subNavSx}
          activeNav={activeNav}
          locked={sidebarLocked}
          toggleDrawer={toggleDrawer}
          setLocked={toggleSidebarLocked}
          className={SideNavItems.groupClassName}
        />
      </Drawer>
    </ClickAwayListener>
  )
}
