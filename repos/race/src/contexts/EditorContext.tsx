import type {
  TFeatureCB,
  TRaceFeature,
  TOnFeatureCB,
  TFeaturesRef,
  TSetFeatureRefs,
  TSetFeatureGroups,
  TOnReturnFeatureCB,
} from '../types'

import {
  useMemo,
  useContext,
  createContext,
} from 'react'

import { noOpObj } from '@keg-hub/jsutils'
import { useFeature } from './FeatureContext'
import { MemoChildren } from '@gobletqa/components'
import { useFeatureCallbacks } from '../hooks/useFeatureCallbacks'

export type TEditorProvider = {
  children:any
  rootPrefix:string
  updateEmptyTab:TFeatureCB
  featuresRef: TFeaturesRef
  onFeatureClose:TOnFeatureCB
  onFeatureChange:TOnFeatureCB
  onFeatureActive:TOnFeatureCB
  onFeatureInactive:TOnFeatureCB
  setFeatureRefs:TSetFeatureRefs
  setFeatureGroups:TSetFeatureGroups
  onBeforeFeatureChange:TOnReturnFeatureCB
}

export type TEditorCtx = {
  rootPrefix:string
  feature:TRaceFeature
  setFeature:TOnFeatureCB
  updateFeature:TOnFeatureCB
}

export const EditorContext = createContext<TEditorCtx>({} as TEditorCtx)
export const useEditor = () => useContext(EditorContext)

export const EditorProvider = (props:TEditorProvider) => {
  const {
    children,
    rootPrefix,
    featuresRef,
    updateEmptyTab,
    setFeatureRefs,
    onFeatureClose,
    onFeatureChange,
    onFeatureActive,
    setFeatureGroups,
    onFeatureInactive,
    onBeforeFeatureChange,
  } = props

  const {
    feature,
    setFeature:_setFeature
  } = useFeature()

  const {
    setFeature,
    updateFeature,
  } = useFeatureCallbacks({
    feature,
    rootPrefix,
    featuresRef,
    setFeatureRefs,
    onFeatureClose,
    updateEmptyTab,
    onFeatureActive,
    onFeatureChange,
    setFeatureGroups,
    onFeatureInactive,
    onBeforeFeatureChange,
    setFeature:_setFeature,
  })

  const editorCtx:TEditorCtx = useMemo(() => {
    return {
      setFeature,
      rootPrefix,
      updateFeature,
      feature: (feature || noOpObj) as TRaceFeature,
    }
  }, [
    feature,
    setFeature,
    rootPrefix,
    updateFeature,
  ])

  return (
    <EditorContext.Provider value={editorCtx}>
      <MemoChildren children={children} />
    </EditorContext.Provider>
  )

}