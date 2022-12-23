import { TAnyCB } from './shared.types'
import type {
  Dispatch,
  ReactNode,
  ElementType,
  CSSProperties,
  SetStateAction,
} from 'react'
import type {
  LinkProps,
  SvgIconProps,
  MenuItemProps,
  TypographyProps,
} from '@mui/material'

export enum ESideNav {
  Editor = `editor`,
  editor = `editor`,
  EDITOR = `editor`,
  Artifacts = `artifacts`,
  artifacts = `artifacts`,
  ARTIFACTS = `artifacts`,
  Environments = `environments`,
  ENVIRONMENTS = `environments`,
  environments = `environments`,
  Files = `files`,
  files = `files`,
  FILES = `files`,
  Settings = `settings`,
  settings = `settings`,
  SETTINGS = `settings`,
}

export type TNavItemClick = {
  name:ESideNav,
  active:ESideNav|undefined,
  setOpen:Dispatch<SetStateAction<boolean>>,
  setActive:Dispatch<SetStateAction<ESideNav | undefined>>,
}

export type TNavItem = {
  title: string,
  action?:TAnyCB
  name?: ESideNav
  hidden?:boolean
  tooltip?: string
  context?: string
  Icon?: ElementType
  style?: CSSProperties
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