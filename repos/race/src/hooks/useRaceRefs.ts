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
import { useInline } from '@gobletqa/components'
import { useFeatureGroups } from './useFeatureGroups'

export type THRaceEditorExt = {
  initialFeature?:TRaceFeature
}

export const useRaceRefs = (props:TRaceEditorProps, { initialFeature }:THRaceEditorExt) => {
  const {
    steps,
    features,
  } = props

  const stepsRef = useRef<TRaceSteps>(steps)
  stepsRef.current = steps

  const featuresRef = useRef<TRaceFeatures>(features)
  featuresRef.current = features

  const [
    featureGroups,
    setFeatureGroups,
    setFeatureRefs
  ] = useFeatureGroups({ featuresRef })

  const onFeatureClose = useInline(props.onFeatureClose || noOp)
  const onFeatureChange = useInline(props.onFeatureChange || noOp)
  const onFeatureActive = useInline(props.onFeatureActive || noOp)
  const onFeatureInactive = useInline(props.onFeatureInactive || noOp)
  const onBeforeFeatureChange = useInline(props.onBeforeFeatureChange || noOp as TOnReturnFeatureCB)

  const editorRef = useRef<TRaceEditor>(null)
  const curValueRef = useRef<string>(initialFeature?.content || ``)
  const curPathRef = useRef<string>(initialFeature?.path || ``)

  return {
    stepsRef,
    editorRef,
    curPathRef,
    curValueRef,
    featuresRef,
    featureGroups,
    setFeatureRefs,
    setFeatureGroups,
    onFeatureClose,
    onFeatureChange,
    onFeatureActive,
    onFeatureInactive,
    onBeforeFeatureChange
  }

}