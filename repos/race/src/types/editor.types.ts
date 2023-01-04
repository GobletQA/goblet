import type { RefObject, MutableRefObject, ComponentType } from 'react'
import type { TRaceSteps } from './steps.types'
import type { TRaceFeatureAsts, TRaceFeatures, TRaceFeature } from './features.types'
import type {
  TAction,
  TTabItem,
  TTabAction,
  EThemeType,
  TSidebarPanel
} from '@gobletqa/components'
import type {
  TStepsRef,
  TFeaturesRef,
  TOnFeatureCB,
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

export type TRaceEditorProps = TEditorContainer & {
  steps:TRaceSteps
  rootPrefix: string
  feature?:TRaceFeature
  themeType?:EThemeType
  features:TRaceFeatureAsts
  firstFeatureActive?:boolean
  onFeatureClose?:TOnFeatureCB
  onFeatureChange?:TOnFeatureCB
  onFeatureActive?:TOnFeatureCB
  onFeatureInactive?:TOnFeatureCB
  onBeforeFeatureChange?:TOnReturnFeatureCB
}

export type TEditorContainer = TFeaturesRefs & TEditorRefs & {
  actions?:TAction[]
  actionsOpen?:boolean
  sidebarWidth?:number
  sidebarStatus?:boolean
  sidebarMaxWidth?:number
  openedTabs:TTabItem[]
  onTabDown?:TTabAction
  onTabLeave?:TTabAction
  onTabHover?:TTabAction
  Panels?:TSidebarPanel[]
  onCloseFeature:TTabAction
  onActiveFeature:TTabAction
  PrePanels?:TSidebarPanel[]
  Divider?:ComponentType<any>
  featureGroups:TRaceFeatures
  onSidebarResize?:(width:number) => void
}