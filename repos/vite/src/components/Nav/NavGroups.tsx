import type { CSSProperties } from 'react'
import type { TNavItemProps } from './NavItem'

import { Fragment } from 'react'
import { SubNav } from './SubNav'
import { NavList } from './NavList'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'

type TNavGroupProps = {
  open?: boolean
  locked?:boolean
  activeNav?: string
  className?: string
  groups: TGroupItem[]
  subNavSx?:CSSProperties
  setLocked?:(lock:boolean) => void
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
    locked,
    subNavSx,
    setLocked,
    className,
    activeNav,
    toggleDrawer
  } = props

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
      <SubNav
        open={open}
        sx={subNavSx}
        locked={locked}
        setLocked={setLocked}
        activeNav={activeNav}
      />
    </Box>
  )
}
