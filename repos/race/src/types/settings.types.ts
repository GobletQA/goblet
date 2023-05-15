
export type TRaceSettings = {
  displayMeta?:boolean
  firstFeatureActive?:boolean
}

export enum ESettingAction {
  Setting = `Setting`,
  Settings = `Settings`,
  ToggleMeta = `ToggleMeta`,
}

export type TSettingUpdate = Partial<TRaceSettings>

export type TSettingAction = {
  type:ESettingAction
  payload:TSettingUpdate
}

export type TUpdateSettingEvt = {
  payload:TSettingUpdate
}

export type TActionMethod = (state:TRaceSettings, action:TSettingAction) => TRaceSettings


export type TToggleRaceModalEvt = {
  state?:boolean
  type?:ERaceModal
  [key:string]: any
}

export enum ERaceModal {
  Confirm=`Confirm`,
  WorldEditor=`WorldEditor`,
}