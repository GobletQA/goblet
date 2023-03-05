import type {
  TFeatureCB,
  TRaceFeature,
  TOnFeatureCB,
  TFeaturesRef,
  TRaceMenuItem,
  TSetFeatureRefs,
  TRaceContextMenu,
  TSetFeatureGroups,
  TOnReturnFeatureCB,
} from '../types'

import {
  useMemo,
  useContext,
  createContext,
} from 'react'

import { useFeature } from './FeatureContext'
import { MemoChildren } from '@gobletqa/components'
import { noOpObj, emptyArr } from '@keg-hub/jsutils'
import { useFeatureCallbacks } from '@GBR/hooks/features/useFeatureCallbacks'

export type TEditorProvider = {
  children:any
  rootPrefix:string
  updateEmptyTab:TFeatureCB
  featuresRef: TFeaturesRef
  onFeatureClose:TOnFeatureCB
  onFeatureChange:TOnFeatureCB
  onFeatureActive:TOnFeatureCB
  menuContext:TRaceContextMenu
  onFeatureInactive:TOnFeatureCB
  setFeatureRefs:TSetFeatureRefs
  setFeatureGroups:TSetFeatureGroups
  onBeforeFeatureChange:TOnReturnFeatureCB
}

export type TEditorCtx = {
  rootPrefix:string
  feature:TRaceFeature
  setFeature:TOnFeatureCB
  displayGeneral?:boolean
  updateFeature:TOnFeatureCB
  menuContext:TRaceContextMenu
}

export const EditorContext = createContext<TEditorCtx>({} as TEditorCtx)
export const useEditor = () => useContext(EditorContext)

export const useMenuContext = (context?:keyof TRaceContextMenu) => {
  const editor = useEditor()
  return context
    ? editor?.menuContext?.[context] || emptyArr as TRaceMenuItem[]
    : emptyArr as TRaceMenuItem[]
}

export const EditorProvider = (props:TEditorProvider) => {
  const {
    children,
    rootPrefix,
    menuContext,
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
      menuContext,
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
