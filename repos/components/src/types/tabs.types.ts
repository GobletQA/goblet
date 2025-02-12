import type { Tab } from '../components/OpenedTabs/Tab'
import type { CSSProperties, SyntheticEvent, ComponentType, MouseEvent } from 'react'

export type TTabAction = (tab:TTab, event?:SyntheticEvent|Event|MouseEvent, ...args:any[]) => void

export type TTabStyles = {
  icon?: CSSProperties
  title?: CSSProperties
}

export type TTab = {
  path?:string
  uuid?:string
  title?:string
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
  scrollToClick?:boolean
  Icon?:ComponentType<any>
}

export type TOpenedTabs = TTabActions & {
  openedTabs?: TTabItem[]
  activeTab?:string|number
  scrollToClick?:boolean
  Tab?:ComponentType<typeof Tab>
  [key:string]:any
}
