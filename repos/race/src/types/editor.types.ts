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
  firstFeatureActive?:boolean
  onFeatureChange?:TOnFeatureCB
  onFeatureUpdate?:TOnFeatureCB
  onBeforeFeatureChange?:TOnReturnFeatureCB
}