import type {
  TRaceSteps,
  TRaceEditor,
  TOnFeatureCB,
  TRaceFeature,
  TRaceFeatures,
  TRaceEditorProps,
  TOnReturnFeatureCB,
} from '../types'

import { useRef } from 'react'
import { noOp } from '@keg-hub/jsutils'

export type THRaceEditorExt = {
  initialFeature?:TRaceFeature
}

export const useRaceRefs = (props:TRaceEditorProps, { initialFeature }:THRaceEditorExt) => {
  const {
    steps,
    features,
    onFeatureClose=noOp,
    onFeatureChange=noOp,
    onFeatureActive=noOp,
    onFeatureInactive=noOp,
    onBeforeFeatureChange=noOp as TOnReturnFeatureCB
  } = props

  const stepsRef = useRef<TRaceSteps>(steps)
  stepsRef.current = steps
  
  const featuresRef = useRef<TRaceFeatures>(features)
  featuresRef.current = features

  const onFeatureCloseRef = useRef<TOnFeatureCB>(onFeatureClose)
  onFeatureCloseRef.current = onFeatureClose

  const onFeatureChangeRef = useRef<TOnFeatureCB>(onFeatureChange)
  onFeatureChangeRef.current = onFeatureChange

  const onFeatureActiveRef = useRef<TOnFeatureCB>(onFeatureActive)
  onFeatureActiveRef.current = onFeatureActive

  const onFeatureInactiveRef = useRef<TOnFeatureCB>(onFeatureActive)
  onFeatureInactiveRef.current = onFeatureInactive

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
    onFeatureCloseRef,
    onFeatureChangeRef,
    onFeatureActiveRef,
    onFeatureInactiveRef,
    onFeatureBeforeChangeRef
  }

}