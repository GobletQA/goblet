import type { SyntheticEvent, ComponentType, ReactNode } from 'react'

export type TPanel = {
  id?:string
  children?:any
  body?:boolean
  header?:boolean
  className?:string
  startOpen?:boolean
  fillHeight?:boolean
  headerHover?:boolean
  actions?:TPanelHeaderAction[]
  title?:string|ReactNode|ComponentType<any>
  onClick?:(event:SyntheticEvent, ...args:any[]) => void
}

export type TPanelHeaderAction = {
  id?:string
  name?:string
  children?:any
  component?:any
  Component?:any
  className?:string
  iconProps?:Record<any, any>
  action?:(...args:any[]) => void
}

export type TPanelHeader = {
  closed: boolean
  hasBody?:boolean
  headerHover?:boolean
  actions?:TPanelHeaderAction[]
  onCollapse: (...args:any[]) => void
  title?:string|ReactNode|ComponentType<any>
}

export type TSidebarPanel = TPanel & {
  pre?:boolean
}
