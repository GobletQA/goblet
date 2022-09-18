import type { ElementType } from 'react'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'

export type TNavItemProps = {
  title: string
  open?: boolean
  index?: number
  group?: string
  last?: boolean
  first?: boolean
  Icon?: ElementType
}

export type TNavListProps = {
  group: string
  index?: number
  open?: boolean
  items: TNavItemProps[]
}

const NavItem = (props:TNavItemProps) => {
  const {
    title,
    Icon,
    open
  } = props

  return (
    <ListItem disablePadding sx={{ display: 'block' }}>
      <ListItemButton
        sx={{
          px: 2.5,
          minHeight: 48,
          justifyContent: open ? 'initial' : 'center',
        }}
      >
        {Icon && (
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: open ? 3 : 'auto',
              justifyContent: 'center',
            }}
          >
            <Icon />
          </ListItemIcon>
        )}
        <ListItemText primary={title} sx={{ opacity: open ? 1 : 0 }} />
      </ListItemButton>
    </ListItem>
  )
}

export const NavList = (props:TNavListProps) => {
  const { items, group, open } = props
  const itemLength = items.length - 1
  return (
    <List>
      {items.map((item:TNavItemProps, idx:number) => {
        return (
          <NavItem
            key={`${group}-${item.title}`}
            {...item}
            open={open}
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
