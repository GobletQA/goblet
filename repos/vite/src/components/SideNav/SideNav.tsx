import type { TNavItemProps } from '../Nav/NavItem'

import { useState, useCallback } from 'react'
import { HeaderSpacer, Drawer } from './SideNav.styled'
import * as Icons from '@components/Icons'
import { NavGroups, TGroupItem } from '../Nav'
import { SideNav as SideNavConst } from '@constants/nav'
import ClickAwayListener from '@mui/base/ClickAwayListener'
import { useSideNavToggle } from '@hooks/components/useSideNavToggle'

const groups = SideNavConst.groups.map(group => {
  const builtGrp = { ...group, items: [] } as TGroupItem
  // @ts-ignore
  group.items.map(({ icon, ...item}) => {
    // @ts-ignore
    const Icon = Icons[icon]
    builtGrp.items.push({
      ...item,
      Icon,
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
  const [activeNav, setActiveNav] = useState<string|undefined>()

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
          className={SideNavConst.groupClassName}
        />
      </Drawer>
    </ClickAwayListener>
  )
}
