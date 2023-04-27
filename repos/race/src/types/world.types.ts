
export type TWorldItem = {
  [key:string]: string|number|null
}

export type TWorldGroup = {
  [key:string]: TWorldGroup | TWorldItem
}

export type TWorldGroupMeta = {
  idx: number
  name: string
  group: TWorldGroup
}
