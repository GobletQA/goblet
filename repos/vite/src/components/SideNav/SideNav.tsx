import type { Dispatch, SetStateAction } from 'react'
import type { TNavItemProps } from '../Nav/NavItem'

import { useState, useCallback } from 'react'
import { dims } from '@theme'
import Box from '@mui/material/Box'
import * as Icons from '@components/Icons'
import Divider from '@mui/material/Divider'
import { NavGroups, TGroupItem } from '../Nav'
import { Goblet } from '@components/Icons/Goblet'
import IconButton from '@mui/material/IconButton'
import { DrawerHeader, Drawer } from './SideNav.styled'
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
        <DrawerHeader className="side-nav-header" >
          <Box className="side-nav-header-icon" >
            <IconButton className="side-nav-header-icon-button" onClick={toggleDrawer} >
              <Goblet />
            </IconButton>
          </Box>
        </DrawerHeader>
        <Divider />
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
