import type { TTab } from '@gobletqa/components'
import type { Parkin, TWorldConfig } from '@ltipton/parkin'
import type { TEditorCtx } from '@GBR/contexts/EditorContext'
import type { TSettingsCtx } from '@GBR/contexts/SettingsContext'
import type { TRaceFeature, TUpdateFeatureCB } from './features.types'
import type { EOperations, TOperationsUpdate } from './operations.types'

export type TOnFeatureEvt = {
  feature:TRaceFeature|undefined
  updateFeature?:TUpdateFeatureCB
}

export type TAskForFeature = {
  cb: TWithFeatureCB
}
export type TWithFeatureCB = (data:TOnFeatureEvt) => void


export type TAnswerEditor = {
  editor:TEditorCtx
}
export type TAskForEditor = {
  cb: TWithEditorCB
}
export type TWithEditorCB = (data:TAnswerEditor) => void


export type TOnParkinInit = {}

export type TOnWorldUpdate = {
  world: TWorldConfig
  replace?:boolean
}

export type TAskForSettings = {
  cb: TWithSettingsCB
}
export type TWithSettingsCB = (data:TSettingsCtx) => void


export type TOnCloseRaceTabEvt = {
  tab:TTab
}

export type TOnUpdateOperationEvt = {
  type:EOperations
  data?:TOperationsUpdate
}