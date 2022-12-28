import type { ComponentType } from 'react'
import type { TRaceSteps } from './steps.types'
import type { TRaceFeatures, TRaceFeature } from './features.types'
import type {
  TAction,
  TTabAction,
  TSidebarPanel
} from '../goblet'
import type {
  TStepsRef,
  TFeaturesRef,
  TOnFeatureCB,
  TOnReturnFeatureCB
} from './helpers.types'


export type TRaceEditor = {
  [key:string]: any
}

export type TEditorRefs = {
  stepsRef: TStepsRef
  featuresRef: TFeaturesRef
}

export type TRaceEditorProps = {
  steps:TRaceSteps
  actions?:TAction[]
  actionsOpen?:boolean
  feature?:TRaceFeature
  features:TRaceFeatures
  sidebarWidth?: number
  sidebarStatus?: boolean
  firstFeatureActive?:boolean
  Divider?:ComponentType<any>
  Panels?:TSidebarPanel[]
  PrePanels?:TSidebarPanel[]
  onFeatureChange?:TOnFeatureCB
  onFeatureUpdate?:TOnFeatureCB
  onSidebarResize?: (width:number) => void
  onBeforeFeatureChange?:TOnReturnFeatureCB
  onFeatureClose?:TOnFeatureCB
  onFeatureActive?:TOnFeatureCB
  onTabHover?:TTabAction
  onTabLeave?:TTabAction
  onTabDown?:TTabAction
}