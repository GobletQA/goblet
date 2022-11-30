
export type TStorageSetting = {
  value: any
  group: string
  active: boolean
}

export type TStorageSettings = {
  [key:string]: TStorageSetting
}