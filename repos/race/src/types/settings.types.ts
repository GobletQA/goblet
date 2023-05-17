import type { EGobletThemeName } from '@gobletqa/components'

export enum EEditorMode {
  simple=`simple`,
  advanced=`advanced`
}


export type TRaceSettings = {
  mode?:EEditorMode
  displayMeta?:boolean|undefined
  confirmDelete?:boolean|undefined
  firstFeatureActive?:boolean|undefined
  themeType?:EGobletThemeName|string|undefined
}

export enum ESettingAction {
  Settings = `Settings`,
  ToggleMeta = `ToggleMeta`,
}

export type TSettingUpdate = Partial<TRaceSettings>

export type TSettingsAction = {
  type:ESettingAction
  payload:TSettingUpdate
}

type TSettingName = {
  setting:keyof TRaceSettings
}

export type TSettingPayload = {
  setting:keyof TRaceSettings
  value:TRaceSettings[TSettingName[`setting`]]
}

export type TUpdateSettingEvt = {
  payload:TSettingPayload
}

export type TActionMethod = (state:TRaceSettings, action:TSettingsAction) => TRaceSettings


export type TToggleRaceModalEvt = {
  state?:boolean
  type?:ERaceModal
  [key:string]: any
}

export enum ERaceModal {
  Confirm=`Confirm`,
  WorldEditor=`WorldEditor`,
}

export type TOnSettingCB = (payload:TSettingPayload) => void