import type { ElementType } from 'react'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'

export type TNavItemProps = {
  title: string
  index?: number
  group?: string
  last?: boolean
  first?: boolean
  Icon?: ElementType
}

export type TNavListProps = {
  group: string
  index?: number
  items: TNavItemProps[]
}

const NavItem = (props:TNavItemProps) => {
  const {
    group,
    title,
    Icon
  } = props
  
  return (
    <ListItem disablePadding>
      <ListItemButton>
        <ListItemIcon>
          {Icon && <Icon />}
        </ListItemIcon>
        <ListItemText primary={title} />
      </ListItemButton>
    </ListItem>
  )
}

export const NavList = (props:TNavListProps) => {
  const { items, group } = props
  const itemLength = items.length - 1
  return (
    <List>
      {items.map((item:TNavItemProps, idx:number) => {
        return (
          <NavItem
            key={`${group}-${item.title}`}
            {...item}
            group={group}
            index={idx}
            first={idx === 0}
            last={idx === itemLength}
          />
        )
      })}
    </List>
  )
}
