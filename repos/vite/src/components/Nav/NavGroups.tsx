import type {CSSProperties } from 'react'
import { Fragment } from 'react'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'

import type { TNavItemProps } from './NavItem'
import { NavList } from './NavList'

type TNavGroupProps = {
  open?: boolean
  groups: TGroupItem[]
  toggleDrawer: (...args:any[]) => any
  anchor?: 'top' | 'left' | 'bottom' | 'right'
}

export type TGroupItem = {
  name: string
  divider?: boolean | 'top' | 'bottom'
  style?: CSSProperties
  items: TNavItemProps[]
}

export const NavGroups = (props: TNavGroupProps) => {
  const {
    open,
    groups,
    anchor,
    toggleDrawer
  } = props
  
  const groupLength = groups.length - 1

  return (
    <Box
      component="div"
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
      role="presentation"
      onClick={toggleDrawer}
      onKeyDown={toggleDrawer}
    >
      {groups.map((group, index:number) => (
        <Fragment key={group.name}>
          {(group.divider === 'top' || group.divider === true) && (<Divider />)}
          <NavList
            open={open}
            index={index}
            group={group.name}
            items={group.items}
            groupStyle={group.style}
          />
          {(group.divider === 'bottom' || group.divider === true) && (<Divider />)}
        </Fragment>
      ))}
    </Box>
  )
}
