
import type { ComponentProps, ReactNode, ComponentType, MouseEvent } from 'react'

import { RenderType } from '../RenderType'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import MuiMenuItem from '@mui/material/MenuItem'
import { useInline } from '@GBC/hooks/useInline'

export type TMenuItem = {
  key?:string
  id?:string
  text?:string
  closeMenu?:boolean
  children?:ReactNode
  iconProps?:ComponentProps<any>
  Icon?:ComponentType<any>|ReactNode
  onClick: (event: MouseEvent<HTMLElement>) => any
  onCloseMenu?:(event: MouseEvent<HTMLElement>) => any
}

export type TMenuItems = {
  items: TMenuItem[]
  autoClose?:boolean
  onCloseMenu?:(event: MouseEvent<HTMLElement>) => any
}

export const MenuItem = (props:TMenuItem) => {
  const {
    text,
    Icon,
    onClick,
    children,
    iconProps,
    onCloseMenu,
    closeMenu=true,
  } = props
  
  const onItemClick = useInline((event:MouseEvent<HTMLElement>) => {
    closeMenu && onCloseMenu?.(event)
    onClick?.(event)
  })

  return (
    <MuiMenuItem onClick={onItemClick}>

      {Icon && (
        <ListItemIcon>
          <RenderType Component={Icon} props={iconProps} />
        </ListItemIcon>
      ) || null}

      {text && (
        <ListItemText>
          {text}
        </ListItemText>
      ) || null}

      {children}
    </MuiMenuItem>
  )
}

export const MenuItems = (props:TMenuItems) => {
  const {
    items,
    onCloseMenu,
    autoClose=true
  } = props

  return (
    <>
      {
        items.map((item) => {
          return (
            <MenuItem
              key={item.key || item.id || item.text}
              {...item}
              onCloseMenu={onCloseMenu}
              closeMenu={autoClose || item.closeMenu}
            />
          )
        })
      }
    </>
  )
}
