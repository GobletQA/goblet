import type { TRaceSettings as TRRaceSettings } from '@gobletqa/race'

export type TSetting = {
  value: any
  key: string
  group?: string
  default?: any
  prefix?: string
  parent?: string
  active?: boolean
  postfix?: string
  display?:boolean
  enabled?: boolean
  options?: string[]
  description?: string
  emptyOption?: string
  onReset?: (event:any) => void
  type?: `string` | `number` | `select` | `boolean`|`tags`
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

export type TRaceSettings = {
  [key in keyof TRRaceSettings]: TSetting
}

export type TSettings = {
  $config: TSettingsConfig
  race: TRaceSettings
  goblet: TSettingGroup
  monaco: TMonacoSettings
  browser: TBrowserSettings
}

export type TMonacoSettings = {
  autoSave: TSetting
  fontSize: TSetting
  automaticLayout: TSetting
  [key:string]: TSettingGroup | TSetting
}

export type TMonacoSettingValues = {
  [key: keyof TMonacoSettings]: any
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

export type TGobletSettings = {
  unit:boolean
  features:boolean
  waypoint:boolean
  lockResize:boolean
  customSteps:boolean
  sidebarLocked:boolean
  worldAutoFormat:boolean
  worldIndentation:number
  parallelEditors:boolean
  browserInBrowser:boolean
  browserIntentClick:boolean
}

export type TBrowserSettingValues = {
  [key: keyof TBrowserSettings]: any
}

