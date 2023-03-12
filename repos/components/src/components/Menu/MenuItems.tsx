
import type { ComponentProps, ReactNode, ComponentType, MouseEvent } from 'react'

import { RenderType } from '../RenderType'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import MuiMenuItem from '@mui/material/MenuItem'
import { useInline } from '@GBC/hooks/components/useInline'

export type TMenuItem<R=Record<any, any>> = {
  key?:string
  id?:string
  text?:string
  closeMenu?:boolean
  children?:ReactNode
  iconProps?:ComponentProps<any>
  Icon?:ComponentType<any>|ReactNode
  onCloseMenu?:(event: MouseEvent<HTMLElement>) => any
  onClick: <T=R>(ctx:T, event: MouseEvent<HTMLElement>) => any
}

export type TMenuItems<T=Record<any, any>> = {
  items: TMenuItem<T>[]
  autoClose?:boolean
  onCloseMenu?:(event: MouseEvent<HTMLElement>) => any
}

export const MenuItem = <T=Record<any, any>>(props:TMenuItem<T>) => {
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
    onClick?.({}, event)
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
