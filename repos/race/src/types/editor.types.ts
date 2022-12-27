import type { ComponentType } from 'react'
import type { TRaceSteps } from './steps.types'
import type { TRaceFeatures, TRaceFeature } from './features.types'
import type {
  TAction,
  TSidebarPanel
} from '../goblet'
import type {
  TStepsRef,
  TFeaturesRef,
  TOnFeatureCB,
  TOnReturnFeatureCB
} from './helpers.types'


export type TEditorRefs = {
  stepsRef: TStepsRef
  featuresRef: TFeaturesRef
}

export type TRaceEditorProps = {
  steps:TRaceSteps
  actions?:TAction[]
  actionsOpen?:boolean
  defaultPath?: string
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
}