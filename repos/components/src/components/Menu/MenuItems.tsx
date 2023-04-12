
import type { ComponentProps, ReactNode, ComponentType, MouseEvent } from 'react'

import { RenderType } from '../RenderType'
import MuiMenuItem from '@mui/material/MenuItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import { useInline } from '@GBC/hooks/components/useInline'

const defIconProps = {
  sx: {
    heigh: `20px`,
    width: `20px`,
  }
}

export type TMenuItem = {
  key?:string
  id?:string
  text?:string
  label?:string
  closeMenu?:boolean
  children?:ReactNode
  iconProps?:ComponentProps<any>
  Icon?:ComponentType<any>|ReactNode
  onCloseMenu?:(event: MouseEvent<HTMLElement>) => any
  onClick: (event: MouseEvent<HTMLElement>, ...args:any[]) => any
}

export type TMenuItems = {
  items: TMenuItem[]
  autoClose?:boolean
  onCloseMenu?:(event: MouseEvent<HTMLElement>) => any
}

export const MenuItem = (props:TMenuItem) => {
  const {
    label,
    Icon,
    onClick,
    children,
    text=label,
    onCloseMenu,
    closeMenu=true,
    iconProps=defIconProps,
  } = props
  
  const onItemClick = useInline((event:MouseEvent<HTMLElement>) => {
    closeMenu && onCloseMenu?.(event)
    onClick?.(event)
  })

  return (
    <MuiMenuItem onClick={onItemClick}>

      {Icon && (
        <ListItemIcon>
          <RenderType
            Component={Icon}
            props={iconProps}
          />
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
