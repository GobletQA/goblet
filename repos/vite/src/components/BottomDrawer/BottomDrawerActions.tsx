import type { CSSProperties, ReactNode } from 'react'

import { cls } from '@keg-hub/jsutils'
import { TooltipHoc } from '@gobletqa/components'

import {
  DrawerSliderAction,
  DrawerSliderActions,
  DrawerActionIconContainer,
} from './BottomDrawer.styled'


type TBottomDrawerAction = {
  id?:string
  name?:string
  tooltip?:string
  onClick:() => any
  Icon:ReactNode
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
    Icon,
    onClick,
    className,
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