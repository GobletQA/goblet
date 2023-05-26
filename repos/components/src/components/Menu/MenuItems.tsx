
import type { ComponentProps, MouseEvent, CSSProperties } from 'react'
import type { TMenuItems, TMenuItem } from '@GBC/types'

import { Tooltip } from '../Tooltip'
import {dims} from '@GBC/theme/dims'
import {colors} from '@GBC/theme/colors'
import { RenderType } from '../RenderType'
import Divider from '@mui/material/Divider'
import { Fragment, forwardRef } from 'react'
import { MenuItemWrap } from './Menu.styled'
import MuiMenuItem from '@mui/material/MenuItem'
import { isStr, omitKeys } from '@keg-hub/jsutils'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import { BtnRmKeys } from '@GBC/components/Buttons/Button'
import { useInline } from '@GBC/hooks/components/useInline'

const defIconProps = {
  sx: {
    heigh: `20px`,
    width: `20px`,
  }
}

export const ItemRmKeys = [
  ...BtnRmKeys,
  `type`,
  `textSx`,
  `iconSx`,
  `iconProps`,
  `Icon`,
]

const styles = {
  sx: {
    transition: `color ${dims.trans.avgEase}`,
    [`&:hover`]: {
      color: colors.purple10
    }
  },
  iconContainerSx: {
    color: `inherit`,
    transition: `color ${dims.trans.fastest} ease`,
  },
  iconSx: {
    color: `inherit`,
    transition: `inherit`,
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
      className='gb-menu-list-item'
      {...omitKeys<Partial<ComponentProps<typeof MuiMenuItem>>>(rest, ItemRmKeys)}
      ref={ref}
      onClick={onItemClick}
      sx={[styles.sx, sx] as CSSProperties[]}
    >
      {Icon && (
        <ListItemIcon
          className='gb-menu-list-item-icon'
          sx={[styles.iconContainerSx, iconContainerSx] as CSSProperties[]}
        >
          <RenderType
            Component={Icon}
            props={{
              ...iconProps,
              sx: [
                styles.iconSx,
                iconProps?.sx,
                iconSx
              ]
            }}
          />
        </ListItemIcon>
      ) || null}

      {text && (
        <ListItemText
          sx={textSx}
          className='gb-menu-list-item-text'
        >
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
                  <MenuItemWrap>
                    <MenuItem
                      {...item}
                      onCloseMenu={onCloseMenu}
                      closeMenu={autoClose || item.closeMenu}
                    />
                  </MenuItemWrap>
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
