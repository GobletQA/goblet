export type TSettingsState = {
  displayMeta?:boolean
}

export enum ESettingAction {
  Setting = `Setting`,
  Settings = `Settings`,
  ToggleMeta = `ToggleMeta`,
}

export type TSettingUpdate = Partial<TSettingsState>

export type TSettingAction = {
  type:ESettingAction
  payload:TSettingUpdate
}

export type TUpdateSettingEvt = {
  payload:TSettingUpdate
}

export type TActionMethod = (state:TSettingsState, action:TSettingAction) => TSettingsState


export type TToggleRaceModalEvt = {
  state?:boolean
  type?:ERaceModal
  [key:string]: any
}

export enum ERaceModal {
  Confirm=`Confirm`,
  WorldEditor=`WorldEditor`,
}