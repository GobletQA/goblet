import type { ComponentType } from 'react'
import type { TRaceSteps } from './steps.types'
import type { TRaceFeatures, TRaceFeature } from './features.types'


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
  feature?:TRaceFeature
  features:TRaceFeatures
  sidebarWidth?: number
  sidebarStatus?: boolean
  firstFeatureActive?:boolean
  Divider?:ComponentType<any>
  onFeatureChange?:TOnFeatureCB
  onFeatureUpdate?:TOnFeatureCB
  onSidebarResize?: (width:number) => void
  onBeforeFeatureChange?:TOnReturnFeatureCB
}