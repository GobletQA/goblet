import type { Tab } from '../components/OpenedTabs/Tab'
import type { SyntheticEvent, ComponentType } from 'react'

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

export type TTabActions = {
  onTabClick?: TTabAction
  onTabHover?: TTabAction
  onTabLeave?: TTabAction
  onTabDown?: TTabAction
  onTabClose?: TTabAction
}

export type TTabItem = TTabActions & {
  tab:TTab
  activeTab?:number
  Icon:ComponentType<any>
}

export type TOpenedTabs = TTabActions & {
  activeTab?:number
  openedTabs: TTabItem[]
  Tab?:ComponentType<typeof Tab>
}
