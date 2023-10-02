import type { CSSProperties, ReactNode } from 'react'

import { cls } from '@keg-hub/jsutils'
import { TooltipHoc } from '@GBC/hocs/TooltipHoc'

import {
  DrawerSliderAction,
  DrawerSliderActions,
  DrawerActionIconContainer,
} from './BottomDrawer.styled'


type TBottomDrawerAction = {
  id?:string
  name?:string
  tooltip?:string
  active?:boolean
  Icon?:ReactNode
  OnIcon?:ReactNode
  OffIcon?:ReactNode
  onClick:() => any
  sx?:CSSProperties
  className?:string
  iconContainerClass?:string
  iconContainerSx?:CSSProperties
}

export type TBottomDrawerActions = {
  sx?:CSSProperties
  className?:string
  children?:ReactNode
  actions?:TBottomDrawerAction[]
}

export const BottomDrawerAction = TooltipHoc((props:TBottomDrawerAction) => {
  const {
    sx,
    OnIcon,
    OffIcon,
    onClick,
    className,
    Icon=OnIcon,
    iconContainerSx,
    iconContainerClass,
  } = props

  return (
    <DrawerSliderAction
      sx={sx}
      onClick={onClick}
      className={cls(`gb-bottom-drawer-action`, className)}
    >
      {Icon && (
        <DrawerActionIconContainer
          sx={iconContainerSx}
          className={cls(`gb-bottom-drawer-action-icon`, iconContainerClass)}
        >
          {Icon}
        </DrawerActionIconContainer>
      )}
    </DrawerSliderAction>
  )
})

export const BottomDrawerActions = (props:TBottomDrawerActions) => {
  const {
    sx,
    actions,
    children,
    className,
  } = props

  return (
    <DrawerSliderActions
      sx={sx}
      className={cls(`gb-bottom-drawer-actions`, className)}
    >
      {actions?.map?.(action => (
        <BottomDrawerAction
          key={action.id || action.name || action.tooltip}
          {...action}
        />
      ))}
      {children}
    </DrawerSliderActions>
  )
}