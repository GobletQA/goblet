import type { ElementType } from 'react'
import { useState } from 'react'
import { useTheme } from '@mui/material/styles'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import { DrawerHeader, Drawer } from './SideNav.styled'
import { NavGroups, TGroupItem } from '../Nav'
import { SideNav as SideNavConst } from '@constants/Nav'
import * as Icons from '@components/Icons'


const groups = SideNavConst.groups.map(group => {
  const builtGrp = { name: group.name, items: [] } as TGroupItem
  group.items.map(({ icon, ...item}) => {
    // @ts-ignore
    const Icon = Icons[icon]
    builtGrp.items.push({
      ...item,
      Icon,
    })
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
    <Drawer variant="permanent" open={open}>
      <DrawerHeader>
        <IconButton onClick={toggleDrawer}>
          {open ? <ChevronLeftIcon /> : <MenuIcon />}
        </IconButton>
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
