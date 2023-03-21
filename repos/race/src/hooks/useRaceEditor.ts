import type { TStepDefsList } from '@ltipton/parkin'
import type {
  TRaceEditor,
  TRaceFeatures,
  TRaceEditorProps,
} from '../types'

import { useRef } from 'react'
import { noOp } from '@keg-hub/jsutils'
import { useInline } from '@gobletqa/components'
import { useFeatureGroups } from '@GBR/hooks/features/useFeatureGroups'
import { useContainerHooks } from '@GBR/hooks/editor/useContainerHooks'
import { useInitTabs } from '@GBR/hooks/tabs/useInitTabs'

export const useRaceEditor = (props:TRaceEditorProps) => {
  const {
    steps,
    features,
    menuContext,
    initialFeature
  } = props

  const stepDefsRef = useRef<TStepDefsList>(steps)
  stepDefsRef.current = steps

  const featuresRef = useRef<TRaceFeatures>(features)
  featuresRef.current = features

  const [
    featureGroups,
    setFeatureGroups,
    setFeatureRefs
  ] = useFeatureGroups({ featuresRef })

  const onFeatureSave = useInline(props.onFeatureSave || noOp)
  const onFeatureClose = useInline(props.onFeatureClose || noOp)
  const onFeatureChange = useInline(props.onFeatureChange || noOp)
  const onFeatureActive = useInline(props.onFeatureActive || noOp)
  const onFeatureInactive = useInline(props.onFeatureInactive || noOp)

  const editorRef = useRef<TRaceEditor>(null)
  const containerRef = useRef<HTMLDivElement|HTMLElement>()

  const curPathRef = useRef<string>(initialFeature?.path || ``)
  const curValueRef = useRef<string>(initialFeature?.content || ``)

  const { onKeyDown } = useContainerHooks({
    containerRef,
    onFeatureSave
  })

  const {
    openedTabs,
    setOpenedTabs,
    updateEmptyTab,
  } = useInitTabs({ feature:initialFeature })

  return {
    editorRef,
    openedTabs,
    onKeyDown,
    curPathRef,
    curValueRef,
    stepDefsRef,
    featuresRef,
    containerRef,
    menuContext,
    setOpenedTabs,
    featureGroups,
    setFeatureRefs,
    onFeatureSave,
    onFeatureClose,
    updateEmptyTab,
    onFeatureChange,
    onFeatureActive,
    setFeatureGroups,
    onFeatureInactive,
  }

}
