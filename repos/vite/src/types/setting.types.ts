export type TSetting = {
  value: any
  key?: string
  group?: string
  active?: boolean
  options?: string[]
  default?: any
  prefix?: string
  postfix?: string
  type?: `string` | `boolean` | `array` | `object` | `number`
}

type TNoSettingKeys = {
  key?: never
  group?: never
  value?: never
  active?: never
}

export type TSettingAct = {
  value?: any
  setting: string
  data?: Partial<TSetting>
}

export type TEditorSettings = {
  autoSave: TSetting
  fontSize: TSetting
  automaticLayout: TSetting
  [key:string]: TSettingGroup | TSetting
}

export type TSettingGroup = TNoSettingKeys & {
  [key:string]: TSettingGroup | TSetting
}

export type TSettingGroupMeta = {
  idx: number
  name: string
  settings: TSettingGroup | TSetting
}

export type TSettingsConfig = {
  editKeys: string[]
  hiddenKeys: string[]
}

export type TSettings = {
  $config: TSettingsConfig
  editor: TEditorSettings
}

export type TEditorSettingValues = {
  [key: keyof TEditorSettings]: any
}

export type TValueGroup = {
  [key:string]: any
}