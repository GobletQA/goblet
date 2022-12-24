import type {
  TOnFeatureCB,
  TRaceSteps,
  TRaceFeatures,
  TRaceEditorProps,
  TOnReturnFeatureCB,
} from '../types'

import { useRef } from 'react'
import { noOp } from '@keg-hub/jsutils'


export const useRaceRefs = (props:TRaceEditorProps) => {
  const {
    steps,
    features,
    onFeatureChange=noOp,
    onFeatureUpdate=noOp,
    onBeforeFeatureChange=noOp as TOnReturnFeatureCB
  } = props

  const stepsRef = useRef<TRaceSteps>(steps)
  stepsRef.current = steps
  
  const featuresRef = useRef<TRaceFeatures>(features)
  featuresRef.current = features

  const onFeatureChangeRef = useRef<TOnFeatureCB>(onFeatureChange)
  onFeatureChangeRef.current = onFeatureChange

  const onFeatureUpdateRef = useRef<TOnFeatureCB>(onFeatureUpdate)
  onFeatureUpdateRef.current = onFeatureUpdate

  const onFeatureBeforeChangeRef = useRef<TOnReturnFeatureCB>(onBeforeFeatureChange)
  onFeatureBeforeChangeRef.current = onBeforeFeatureChange

  return {
    stepsRef,
    featuresRef,
    onFeatureChangeRef,
    onFeatureUpdateRef,
    onFeatureBeforeChangeRef
  }

}