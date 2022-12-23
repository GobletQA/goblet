import type { TNavItemProps } from '../Nav/NavItem'

import { useState, useCallback } from 'react'
import { ESideNav } from '@types'
import { navItemNameToTitle } from '@utils'
import { NavGroups, TGroupItem } from '../Nav'
import { HeaderSpacer, Drawer } from './SideNav.styled'
import { SideNav as SideNavItems } from '@constants/nav'
import ClickAwayListener from '@mui/base/ClickAwayListener'
import { useSideNavToggle } from '@hooks/nav/useSideNavToggle'

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
  const [open, setOpen] = useState(false)
  const [activeNav, setActiveNav] = useState<ESideNav|undefined>()

  const toggleDrawer = useSideNavToggle(
    open,
    setOpen,
    activeNav,
    setActiveNav
  )

  const onClickAway = useCallback((event: MouseEvent | TouchEvent) => {
    open && setOpen(false)
  }, [open])

  return (
    <ClickAwayListener onClickAway={onClickAway} >
      <Drawer className="side-nav-drawer" variant="permanent" open={open}>
        <HeaderSpacer />
        <NavGroups
          {...props}
          open={open}
          groups={groups}
          activeNav={activeNav}
          toggleDrawer={toggleDrawer}
          className={SideNavItems.groupClassName}
        />
      </Drawer>
    </ClickAwayListener>
  )
}
