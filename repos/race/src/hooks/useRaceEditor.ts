import type {
  TRaceSteps,
  TRaceEditor,
  TRaceFeatures,
  TRaceEditorProps,
  TOnReturnFeatureCB,
} from '../types'

import { useRef } from 'react'
import { noOp } from '@keg-hub/jsutils'
import { useInline } from '@gobletqa/components'
import { useFeatureGroups } from './useFeatureGroups'
import { useOpenedTabs } from '@GBR/hooks/useOpenedTabs'

export const useRaceEditor = (props:TRaceEditorProps) => {
  const {
    steps,
    features,
    initialFeature
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

  const {
    onTabDown,
    openedTabs,
    onTabHover,
    onTabLeave,
    updateEmptyTab,
    onCloseFeature,
    onActiveFeature,
  } = useOpenedTabs({
    featuresRef,
    onFeatureClose,
    onFeatureActive,
    onTabDown: props.onTabDown,
    onTabLeave: props.onTabLeave,
    onTabHover: props.onTabHover,
  })


  return {
    stepsRef,
    editorRef,
    onTabDown,
    openedTabs,
    onTabHover,
    onTabLeave,
    curPathRef,
    curValueRef,
    featuresRef,
    featureGroups,
    updateEmptyTab,
    onCloseFeature,
    setFeatureRefs,
    onActiveFeature,
    onFeatureClose,
    onFeatureChange,
    onFeatureActive,
    setFeatureGroups,
    onFeatureInactive,
    onBeforeFeatureChange,
  }

}
