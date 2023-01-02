import type { RefObject, MutableRefObject, ComponentType } from 'react'
import type { TRaceSteps } from './steps.types'
import type { TRaceFeatureAsts, TRaceFeatures, TRaceFeature } from './features.types'
import type {
  TAction,
  TTabAction,
  EThemeType,
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
  rootPrefix: string
  actionsOpen?:boolean
  feature?:TRaceFeature
  sidebarWidth?:number
  themeType?:EThemeType
  sidebarStatus?:boolean
  sidebarMaxWidth?:number
  Panels?:TSidebarPanel[]
  PrePanels?:TSidebarPanel[]
  features:TRaceFeatureAsts
  firstFeatureActive?:boolean
  Divider?:ComponentType<any>
  onFeatureClose?:TOnFeatureCB
  onFeatureChange?:TOnFeatureCB
  onFeatureActive?:TOnFeatureCB
  onFeatureInactive?:TOnFeatureCB
  onTabDown?:TTabAction
  onTabLeave?:TTabAction
  onTabHover?:TTabAction
  onSidebarResize?:(width:number) => void
  onBeforeFeatureChange?:TOnReturnFeatureCB
}

export type TEditorContainer = TRaceEditorProps & TFeaturesRefs & TEditorRefs & {
  featureGroups:TRaceFeatures
  onFeatureCloseRef:TOnFeatureCBRef
  onFeatureActiveRef:TOnFeatureCBRef
}