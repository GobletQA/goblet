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

export const useRaceEditor = (props:TRaceEditorProps) => {
  const {
    features,
    definitions,
    menuContext,
    initialFeature
  } = props

  const stepDefsRef = useRef<TStepDefsList>(definitions)
  stepDefsRef.current = definitions
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
   * TODO: Would be good to track updates to featuresRefs outside of Race
   * But doing that causes issues internally
   * If the external feature is out of date, then
   * Add this code will update the internal Race feature
   * to an out of date version
   * Would need to add a timestamp to the AST, but that will require a lot of work
   * Something that can be investigated later
   */
  // useEffect(() => {
  //   features !== featuresRef.current
  //     && setFeatureRefs(features)
  // }, [features])

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
