import type { SyntheticEvent, ReactNode, ComponentType } from 'react'

export type TTabAction = (event:SyntheticEvent, tab:TTab, key?: number|string) => void

export type TTab = {
  title?:string
  name?:string
  path?:string
  id?:number
  key?:number
  editing?:boolean
  active?:boolean
}

export type TTabItem = {
  tab:TTab
  activeTab:number
  Icon:ComponentType<any>
  onTabClick?: TTabAction
  onTabHover?: TTabAction
  onTabLeave?: TTabAction
  onTabDown?: TTabAction
  onTabClose?: TTabAction
  rootEl: HTMLElement | null
}

export type TOpenedTabs = {
  rootEl: HTMLElement | null
  activeTab:number
  openedTabs: TTabItem[],
  onTabDown?: TTabAction
  onTabHover?: TTabAction
  onTabLeave?: TTabAction
  onTabClose?: TTabAction
  onTabClick?: TTabAction
  onTabInactive?: TTabAction
}
