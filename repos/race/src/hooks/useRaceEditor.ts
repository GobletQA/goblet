import type { MutableRefObject } from 'react'
import type { TStepDefsList } from '@ltipton/parkin'
import type { TEditorCtx } from '@GBR/contexts/EditorContext'
import type {
  TRaceFeatures,
  TRaceEditorProps,
} from '../types'

import { noOp } from '@keg-hub/jsutils'
import { useRef, useEffect } from 'react'
import { useInline } from '@gobletqa/components'
import { useInitTabs } from '@GBR/hooks/tabs/useInitTabs'
import { useFeatureGroups } from '@GBR/hooks/features/useFeatureGroups'
import { useContainerHooks } from '@GBR/hooks/editor/useContainerHooks'
import { useFeatureIsEmpty } from '@GBR/hooks/features/useFeatureIsEmpty'

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

  const [
    featureGroups,
    setFeatureRefs,
    setFeatureGroups,
  ] = useFeatureGroups({ featuresRef })

  const onFeatureSave = useInline(props.onFeatureSave || noOp)
  const onFeatureClose = useInline(props.onFeatureClose || noOp)
  const onFeatureChange = useInline(props.onFeatureChange || noOp)
  const onFeatureActive = useInline(props.onFeatureActive || noOp)
  const onFeatureCreate = useInline(props.onFeatureCreate || noOp)
  const onFeatureDelete = useInline(props.onFeatureDelete || noOp)
  const onFeatureInactive = useInline(props.onFeatureInactive || noOp)

  const containerRef = useRef<HTMLDivElement|HTMLElement>()
  const editorRef = useRef<TEditorCtx>(null) as MutableRefObject<TEditorCtx>

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

  useEffect(() => {
    initialFeature
      && onFeatureActive?.(initialFeature)
  }, [])

  /**
   * Track changes to the features object
   * They can be changed externally to the Race Editor
   * If they are, make sure to update the featureRefs to reflect that
   */
  useEffect(() => {
    features !== featuresRef.current
      && setFeatureRefs(features)
  }, [features])

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
    onFeatureCreate,
    onFeatureActive,
    onFeatureDelete,
    setFeatureGroups,
    onFeatureInactive,
  }

}
