
import type { MouseEvent } from 'react'
import type { TMenuItems, TMenuItem } from '@GBC/types'

import { Fragment } from 'react'
import { RenderType } from '../RenderType'
import Divider from '@mui/material/Divider'
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

export const MenuItem = (props:TMenuItem) => {
  const {
    label,
    Icon,
    onClick,
    children,
    text=label,
    onCloseMenu,
    closeParent,
    closeMenu=true,
    iconProps=defIconProps,
  } = props

  const onItemClick = useInline((event:MouseEvent<HTMLElement>, ...args:any[]) => {
    closeMenu && onCloseMenu?.(event, closeParent)
    onClick?.(event, ...args)
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
    autoClose,
    onCloseMenu,
  } = props

  return (
    <>
      {
        items.map((item) => {
          return (
            <Fragment key={item.key || item.id || item.text} >
              {item.dividerTop && <Divider />}
              <MenuItem
                {...item}
                onCloseMenu={onCloseMenu}
                closeMenu={autoClose || item.closeMenu}
              />
              {item.dividerBottom && <Divider />}
            </Fragment>
          )
        })
      }
    </>
  )
}
