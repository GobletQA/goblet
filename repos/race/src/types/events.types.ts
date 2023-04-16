import type { Parkin } from '@ltipton/parkin'
import type { TRaceFeature } from './features.types'
import type { TEditorCtx } from '@GBR/contexts/EditorContext'

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