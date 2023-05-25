import type { MutableRefObject } from 'react'
import type { TStepDefsList } from '@ltipton/parkin'
import type { TEditorCtx } from '@GBR/contexts/EditorContext'
import type {
  TRaceFeatures,
  TGetOpenedTabs,
  TRaceEditorProps,
} from '@GBR/types'

import { noOp } from '@keg-hub/jsutils'
import { useRef, useEffect, useMemo, createRef } from 'react'
import { useInline } from '@gobletqa/components'
import { useInitTabs } from '@GBR/hooks/tabs/useInitTabs'
import { useContainerHooks } from '@GBR/hooks/editor/useContainerHooks'
import { useFeatureGroups } from '@GBR/hooks/featureGroups/useFeatureGroups'

export const useRaceSetup = (props:TRaceEditorProps) => {
  const {
    features,
    rootPrefix,
    definitions,
    menuContext,
    initialFeature
  } = props

  const stepDefsRef = useRef<TStepDefsList>(definitions)
  stepDefsRef.current = definitions
  const featuresRef = useRef<TRaceFeatures>(features)

  const {
    openedTabs,
    setOpenedTabs,
    updateEmptyTab,
  } = useInitTabs({ feature:initialFeature })

  const {
    featureGroups,
    setTabsAndGroups,
    setFeatureGroups,
  } = useFeatureGroups({
    openedTabs,
    rootPrefix,
    featuresRef,
    setOpenedTabs,
  })

  const onFeatureSave = useInline(props.onFeatureSave || noOp)
  const onFeatureClose = useInline(props.onFeatureClose || noOp)
  const onFeatureChange = useInline(props.onFeatureChange || noOp)
  const onFeatureActive = useInline(props.onFeatureActive || noOp)
  const onFeatureCreate = useInline(props.onFeatureCreate || noOp)
  const onFeatureDelete = useInline(props.onFeatureDelete || noOp)
  const onFeatureRename = useInline(props.onFeatureRename || noOp)
  const onFeatureInactive = useInline(props.onFeatureInactive || noOp)
  const getOpenedTabs = useInline<TGetOpenedTabs>(() => openedTabs)

  const containerRef = useRef<HTMLDivElement|HTMLElement>()

  const localEditorRef = useRef<TEditorCtx>(null) as MutableRefObject<TEditorCtx>
  const editorRef = useMemo(
    () => (props.editorRef || localEditorRef),
    [props.editorRef, localEditorRef]
  )

  

  const curPathRef = useRef<string>(initialFeature?.path || ``)
  const curValueRef = useRef<string>(initialFeature?.content || ``)

  const { onKeyDown } = useContainerHooks({
    containerRef,
    onFeatureSave
  })

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
  //     && setTabsAndGroups({ items: features})
  // }, [features])

  return {
    editorRef,
    openedTabs,
    onKeyDown,
    curPathRef,
    curValueRef,
    stepDefsRef,
    featuresRef,
    menuContext,
    containerRef,
    getOpenedTabs,
    setOpenedTabs,
    featureGroups,
    onFeatureSave,
    onFeatureClose,
    updateEmptyTab,
    onFeatureChange,
    onFeatureCreate,
    onFeatureActive,
    onFeatureDelete,
    onFeatureRename,
    setTabsAndGroups,
    setFeatureGroups,
    onFeatureInactive
  }

}