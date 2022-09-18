import type { TNavItemProps } from '../Nav/NavItem'

import { useState } from 'react'
import { dims } from '@theme'
import Box from '@mui/material/Box'
import * as Icons from '@components/Icons'
import Divider from '@mui/material/Divider'
import { NavGroups, TGroupItem } from '../Nav'
import { useTheme } from '@mui/material/styles'
import { Goblet } from '@components/Icons/Goblet'
import IconButton from '@mui/material/IconButton'
import { DrawerHeader, Drawer } from './SideNav.styled'
import { SideNav as SideNavConst } from '@constants/Nav'


const groups = SideNavConst.groups.map(group => {
  const builtGrp = { ...group, items: [] } as TGroupItem
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
  const theme = useTheme()
  const [open, setOpen] = useState(false)

  const toggleDrawer = () => {
    setOpen(!open)
  }

  return (
    <Drawer className="side-nav-drawer" variant="permanent" open={open}>
      <DrawerHeader
        className="side-nav-header"
        sx={{ minHeight: `${dims.header.height}px !important` }}
      >
        <Box className="side-nav-header-icon" >
          <IconButton className="side-nav-header-icon-button" onClick={toggleDrawer} >
            {/* {open ? <ChevronLeftIcon /> : <Goblet />} */}
            <Goblet />
          </IconButton>
        </Box>
      </DrawerHeader>
      <Divider />
      <NavGroups
        {...props}
        open={open}
        groups={groups}
        toggleDrawer={toggleDrawer}
      />
    </Drawer>
  )
}
