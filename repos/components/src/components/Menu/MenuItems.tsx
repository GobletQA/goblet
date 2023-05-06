
import type { ComponentProps, RefObject, MouseEvent } from 'react'
import type { TMenuItems, TMenuItem } from '@GBC/types'

import { Fragment, forwardRef } from 'react'
import { Tooltip } from '../Tooltip'
import { RenderType } from '../RenderType'
import { isStr, omitKeys } from '@keg-hub/jsutils'
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

export const MenuItem = forwardRef<HTMLLIElement, TMenuItem>((props, ref) => {
  const {
    sx,
    Icon,
    label,
    iconSx,
    onClick,
    textSx,
    children,
    tooltip,
    text=label,
    dividerTop,
    onCloseMenu,
    closeParent,
    closeMenu=true,
    iconContainerSx,
    iconProps=defIconProps,
    ...rest
  } = props

  const onItemClick = useInline((event:MouseEvent<HTMLElement>, ...args:any[]) => {
    closeMenu && onCloseMenu?.(event, closeParent)
    onClick?.(event, ...args)
  })

  return (
    <MuiMenuItem
      {...omitKeys<Partial<ComponentProps<typeof MuiMenuItem>>>(rest, [`type`, `featureKey`])}
      sx={sx}
      ref={ref}
      onClick={onItemClick}
    >
      {Icon && (
        <ListItemIcon sx={iconContainerSx} >
          <RenderType
            Component={Icon}
            props={{...iconProps, sx: [iconProps?.sx, iconSx]}}
          />
        </ListItemIcon>
      ) || null}

      {text && (
        <ListItemText sx={textSx} >
          {text}
        </ListItemText>
      ) || null}

      {children}
    </MuiMenuItem>
  )
})

export const MenuItems = (props:TMenuItems) => {
  const {
    items,
    autoClose,
    onCloseMenu,
  } = props

  return (
    <>
      {
        items.map(({tooltip, ...item}) => {
          return (
            <Fragment key={item.key || item.id || item.text} >
              {item.dividerTop && <Divider />}
              
              {tooltip ? (
                <Tooltip
                  {...(isStr(tooltip)
                    ? { describeChild: true, loc: `bottom`, title: tooltip }
                    : tooltip
                  )}
                >
                  <MenuItem
                    {...item}
                    onCloseMenu={onCloseMenu}
                    closeMenu={autoClose || item.closeMenu}
                  />
                </Tooltip>
              ): (
                <MenuItem
                  {...item}
                  onCloseMenu={onCloseMenu}
                  closeMenu={autoClose || item.closeMenu}
                />
              )}

              {item.dividerBottom && <Divider />}
            </Fragment>
          )
        })
      }
    </>
  )
}
