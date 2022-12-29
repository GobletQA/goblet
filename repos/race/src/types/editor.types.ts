import type { RefObject, MutableRefObject, ComponentType } from 'react'
import type { TRaceSteps } from './steps.types'
import type { TRaceFeatures, TRaceFeature } from './features.types'
import type {
  TAction,
  TTabAction,
  TSidebarPanel
} from '@gobletqa/components'
import type {
  TStepsRef,
  TFeaturesRef,
  TOnFeatureCB,
  TOnFeatureCBRef,
  TOnReturnFeatureCB
} from './helpers.types'

export type TRaceEditor = {
  [key:string]: any
}

export type TFeaturesRefs = {
  stepsRef: TStepsRef
  featuresRef: TFeaturesRef
}

export type TEditorRef = RefObject<TRaceEditor>

export type TEditorRefs = {
  editorRef: TEditorRef
  curPathRef: MutableRefObject<string>
  curValueRef: MutableRefObject<string>
}

export type TRaceEditorProps = {
  steps:TRaceSteps
  actions?:TAction[]
  actionsOpen?:boolean
  feature?:TRaceFeature
  features:TRaceFeatures
  sidebarWidth?: number
  sidebarStatus?: boolean
  sidebarMaxWidth?: number
  firstFeatureActive?:boolean
  Divider?:ComponentType<any>
  Panels?:TSidebarPanel[]
  PrePanels?:TSidebarPanel[]
  onFeatureClose?:TOnFeatureCB
  onFeatureChange?:TOnFeatureCB
  onFeatureActive?:TOnFeatureCB
  onFeatureInactive?:TOnFeatureCB
  onBeforeFeatureChange?:TOnReturnFeatureCB
  onSidebarResize?: (width:number) => void
  onTabHover?:TTabAction
  onTabLeave?:TTabAction
  onTabDown?:TTabAction
}

export type TEditorContainer = TRaceEditorProps & TFeaturesRefs & TEditorRefs & {
  onFeatureCloseRef:TOnFeatureCBRef
  onFeatureActiveRef:TOnFeatureCBRef
}