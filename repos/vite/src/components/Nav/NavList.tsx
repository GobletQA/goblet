import type { CSSProperties } from 'react'

import { Fragment } from 'react'
import type { TNavItemProps } from './NavItem'
import { NavItem } from './NavItem'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'


export type TNavListProps = {
  group: string
  index?: number
  open?: boolean
  activeNav?: string
  className?: string
  items: TNavItemProps[]
  groupStyle?: CSSProperties
}

export const NavList = (props:TNavListProps) => {
  const { items, groupStyle, group, open, className, activeNav } = props
  const itemLength = items.length - 1
  return (
    <List sx={groupStyle} className={`${group}-group-nav-list ${className || ``}`.trim()}  >
      {items.map((item:TNavItemProps, idx:number) => {
        return (
          <Fragment key={`${group}-${item.title}`} >
            {(item.divider === 'top' || item.divider === true) && (<Divider />)}
            <NavItem
              {...item}
              open={open}
              group={group}
              index={idx}
              first={idx === 0}
              activeNav={activeNav}
              last={idx === itemLength}
            />
            {(item.divider === 'bottom' || item.divider === true) && (<Divider />)}
          </Fragment>
        )
      })}
    </List>
  )
}
