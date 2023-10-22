

export type TGroupItem = {
  title:string
  uuid:string
  [key:string]: any
}

export type TGroup = {
  type: string
  group?: string
  toggled: boolean,
  items: TGroupItem[]
}

export type TGroupList = Record<string, any>

export type TGroupType = string

export type TTypeGroup = {
  [key:string]: TGroup
}

export type TGroups = {
  [key:string]: TGroup
}