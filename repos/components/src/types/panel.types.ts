export type TPanel = {
  id?:string
  title:string
  children?:any
  header?:boolean
  className?:string
  startOpen?:boolean
  fillHeight?:boolean
  actions?:TPanelHeaderAction[]
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
  title: string
  closed: boolean
  actions?:TPanelHeaderAction[]
  onCollapse: (...args:any[]) => void
}

export type TSidebarPanel = TPanel & {
  pre?:boolean
}
