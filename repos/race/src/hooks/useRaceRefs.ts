import type {
  TRaceEditor,
  TRaceSteps,
  TOnFeatureCB,
  TRaceFeatures,
  TRaceEditorProps,
  TOnReturnFeatureCB,
} from '../types'

import { useRef } from 'react'
import { noOp } from '@keg-hub/jsutils'
import { useInitialFeature } from './useInitialFeature'


export const useRaceRefs = (props:TRaceEditorProps) => {
  const {
    steps,
    features,
    onFeatureChange=noOp,
    onFeatureUpdate=noOp,
    onBeforeFeatureChange=noOp as TOnReturnFeatureCB
  } = props

  const initialFeature = useInitialFeature(props)

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

  const editorRef = useRef<TRaceEditor>(null)
  const curValueRef = useRef<string>(initialFeature?.content || ``)
  const curPathRef = useRef<string>(initialFeature?.path || ``)

  return {
    stepsRef,
    editorRef,
    curPathRef,
    curValueRef,
    featuresRef,
    initialFeature,
    onFeatureChangeRef,
    onFeatureUpdateRef,
    onFeatureBeforeChangeRef
  }

}