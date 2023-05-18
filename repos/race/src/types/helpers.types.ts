import type { ESectionType } from './section.types'
import type { TStepDefsList } from '@ltipton/parkin'
import type { TRaceFeatures, TRaceFeature } from './features.types'
import type {
  MouseEvent,
  KeyboardEvent,
  SyntheticEvent,
  MutableRefObject,
} from 'react'



export type TSetSteps = (steps:TStepDefsList) => void
export type TStepDefsRef = MutableRefObject<TStepDefsList>
export type TFeaturesRef = MutableRefObject<TRaceFeatures>
export type TSetFeatureRefs = (features:TRaceFeatures) => void
export type TSetFeatureGroups = (features:TRaceFeatures) => void

export type TOnFolderCreateCB = (location?:string) => void
export type TOnFeatureCBRef = MutableRefObject<TOnFeatureCB>
export type TFeatureCB = (feature: TRaceFeature) => void
export type TOnFeatureCB = (feature?:TRaceFeature, ...rest:any[]) => void
export type TSetFeature = (feature?:TRaceFeature) => void
export type TOnAddClick = (evt:SyntheticEvent, parentId?:string, type?:ESectionType) => void

export enum EPatchType {
  add = `add`,
  remove = `remove`,
  update = `update`,
  replace = `replace`,
}

export enum EMetaType {
  tags=`tags`,
  role=`role`,
  persona=`persona`,
  reason=`reason`,
  desire=`desire`,
  perspective=`perspective`,
}


export type TEditorFeatureAction<T1=unknown, T2=unknown> = (
  evt:Event|MouseEvent|KeyboardEvent,
  data:T1,
  other?:T2
) => void
export type TOnEditFeature = TEditorFeatureAction<string, boolean>
export type TOnDeleteFeature = TEditorFeatureAction<string>
export type TOnActiveFeature = TEditorFeatureAction<TRaceFeature|undefined, boolean>
export type TOnCloseFeature = TEditorFeatureAction<TRaceFeature|undefined, TRaceFeature|undefined>

export type TEditorFeatureActions = {
  editingName?:string
  onEditFeature?:TOnEditFeature
  onCloseFeature?:TOnCloseFeature
  onDeleteFeature?:TOnDeleteFeature
  onActiveFeature?:TOnActiveFeature
}


export type TOnEditGroupName = (
  event:MouseEvent|KeyboardEvent|Event,
  name:string,
  cancel?:boolean
) => void