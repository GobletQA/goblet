import type { TRaceFeature } from './features.types'
import type { Parkin, TWorldConfig } from '@ltipton/parkin'
import type { TEditorCtx } from '@GBR/contexts/EditorContext'
import type { TSettingsCtx } from '@GBR/contexts/SettingsContext'

export type TAnswerFeature = {
  feature:TRaceFeature
}
export type TAskForFeature = {
  cb: TWithFeatureCB
}
export type TWithFeatureCB = (data:TAnswerFeature) => void


export type TAnswerEditor = {
  editor:TEditorCtx
}
export type TAskForEditor = {
  cb: TWithEditorCB
}
export type TWithEditorCB = (data:TAnswerEditor) => void


export type TOnParkinInit = {
  parkin: Parkin
}

export type TOnWorldUpdate = {
  world: TWorldConfig
  replace?:boolean
}

export type TAskForSettings = {
  cb: TWithSettingsCB
}
export type TWithSettingsCB = (data:TSettingsCtx) => void
