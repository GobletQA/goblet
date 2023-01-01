import type { Tab } from '../components/OpenedTabs/Tab'
import type { CSSProperties, SyntheticEvent, ComponentType } from 'react'

export type TTabAction = (tab:TTab, event?:SyntheticEvent, ...args:any[]) => void

export type TTabStyles = {
  icon?: CSSProperties
  title?: CSSProperties
}

export type TTab = {
  uuid?:string
  title?:string
  path?:string
  active?:boolean
  editing?:boolean
  [key:string]: any
}

export type TTabActions = {
  onTabClick?: TTabAction
  onTabHover?: TTabAction
  onTabLeave?: TTabAction
  onTabDown?: TTabAction
  onTabClose?: TTabAction
}

export type TTabItem = TTabActions & {
  tab:TTab
  active?:boolean
  styles?:TTabStyles
  Icon?:ComponentType<any>
}

export type TOpenedTabs = TTabActions & {
  openedTabs?: TTabItem[]
  activeTab?:string|number
  Tab?:ComponentType<typeof Tab>
  [key:string]:any
}
