export type TSetting = {
  value: any
  key: string
  group?: string
  default?: any
  prefix?: string
  parent?: string
  active?: boolean
  postfix?: string
  enabled?: boolean
  options?: string[]
  emptyOption?: string
  type?: `string` | `number` | `select` | `boolean`
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

export type TGeneralSettings = {
  [key:string]: TSettingGroup | TSetting
}

export type TValueGroup = {
  [key:string]: any
}


// ---- Key specific Settings and Groups ---- //

export type TSettings = {
  $config: TSettingsConfig
  editor: TEditorSettings
  goblet: TSettingGroup
  browser: TBrowserSettings
  terminal: TSettingGroup
}

export type TEditorSettings = {
  autoSave: TSetting
  fontSize: TSetting
  automaticLayout: TSetting
  [key:string]: TSettingGroup | TSetting
}

export type TEditorSettingValues = {
  [key: keyof TEditorSettings]: any
}

export type TBrowserSettings = {
  ws: TSetting
  debug: TSetting
  slowMo: TSetting
  height: TSetting
  width: TSetting
  timeout: TSetting
  [key:string]: TSetting
}

export type TBrowserSettingValues = {
  [key: keyof TBrowserSettings]: any
}

