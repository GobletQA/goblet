import type { ReactNode, CSSProperties } from 'react'

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
