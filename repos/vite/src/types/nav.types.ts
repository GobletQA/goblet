import { TAnyCB } from './shared.types'
import type { ReactNode, CSSProperties } from 'react'
import type {
  LinkProps,
  SvgIconProps,
  MenuItemProps,
  TypographyProps,
} from '@mui/material'

export type TNavItem = {
  title: string,
  icon?: string | ReactNode
  style?: CSSProperties
  [key:string]: any
}

export type TNavGroup = {
  name: string
  style?: CSSProperties
  items: TNavItem[]
  [key:string]: any
}

export type TSideNav = {
  groupClassName?: string
  groups: TNavGroup[]
}

export type TSettingNavItem = {
  Icon?: any
  path?: string
  label: string
  onClick?: TAnyCB
  divider?: boolean
  linkProps?: LinkProps
  iconProps?: SvgIconProps
  itemProps?: MenuItemProps
  textProps?:TypographyProps
}