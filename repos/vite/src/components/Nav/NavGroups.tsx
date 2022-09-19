import type {CSSProperties } from 'react'
import type { TNavItemProps } from './NavItem'

import { Fragment } from 'react'
import { SubNav } from './SubNav'
import { NavList } from './NavList'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'

type TNavGroupProps = {
  open?: boolean
  groups: TGroupItem[]
  activeNav?: string
  className?: string
  toggleDrawer: (...args:any[]) => any
  anchor?: 'top' | 'left' | 'bottom' | 'right'
}

export type TGroupItem = {
  name: string
  className?: string
  divider?: boolean | 'top' | 'bottom'
  style?: CSSProperties
  items: TNavItemProps[]
}

export const NavGroups = (props: TNavGroupProps) => {
  const {
    open,
    groups,
    anchor,
    className,
    activeNav,
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
            className={className}
            activeNav={activeNav}
            groupStyle={group.style}
          />
          {(group.divider === 'bottom' || group.divider === true) && (<Divider />)}
        </Fragment>
      ))}
      <SubNav activeNav={activeNav} open={open} />
    </Box>
  )
}
