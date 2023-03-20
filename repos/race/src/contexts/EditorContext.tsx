import type {
  TFeatureCB,
  TRaceFeature,
  TOnFeatureCB,
  TFeaturesRef,
  TRaceMenuItem,
  TSetFeatureRefs,
  TRaceContextMenu,
  TUpdateFeatureCB,
  TSetFeatureGroups,
} from '../types'
import type { TIndexAst } from '@ltipton/parkin'

import {
  useMemo,
  useState,
  useContext,
  useCallback,
  createContext,
} from 'react'

import { useFeature } from './FeatureContext'
import { MemoChildren } from '@gobletqa/components'
import { emptyObj, emptyArr, exists } from '@keg-hub/jsutils'
import { useFeatureCallbacks } from '@GBR/hooks/features/useFeatureCallbacks'

export type TExpanded = Record<string, boolean>
export type TOnExpandedCB =  (key:string, value:boolean) => void
export type TEditorProvider = {
  children:any
  rootPrefix:string
  updateEmptyTab:TFeatureCB
  featuresRef: TFeaturesRef
  onFeatureClose:TOnFeatureCB
  onFeatureChange:TOnFeatureCB
  onFeatureActive:TOnFeatureCB
  menuContext?:TRaceContextMenu
  onFeatureInactive:TOnFeatureCB
  setFeatureRefs:TSetFeatureRefs
  setFeatureGroups:TSetFeatureGroups
}

export type TEditorCtx = {
  rootPrefix:string
  expanded:TExpanded
  displayMeta?:boolean
  feature:TRaceFeature
  setFeature:TOnFeatureCB
  updateExpanded:TOnExpandedCB
  updateFeature:TUpdateFeatureCB
  menuContext?:TRaceContextMenu
}

export const EditorContext = createContext<TEditorCtx>({} as TEditorCtx)
export const useEditor = () => useContext(EditorContext)

export const useMenuContext = (context?:keyof TRaceContextMenu) => {
  const editor = useEditor()
  return context
    ? editor?.menuContext?.[context] || emptyArr as TRaceMenuItem[]
    : emptyArr as TRaceMenuItem[]
}

const useExpanded = () => {
  const [expanded, setExpanded] = useState<TExpanded>({})

  const updateExpanded = useCallback((key:string, value?:boolean) => {
    const val = exists<boolean>(value)
      ? value
      : exists<boolean>(expanded[key])
        ? !expanded[key]
        : true

    setExpanded({...expanded, [key]: val})
  }, [expanded])

  return {
    expanded,
    setExpanded,
    updateExpanded
  }
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
  } = props

  const {
    feature,
    setFeature:_setFeature
  } = useFeature()

  const {expanded, updateExpanded} = useExpanded()

  const {
    setFeature,
    updateFeature,
  } = useFeatureCallbacks({
    feature,
    expanded,
    rootPrefix,
    featuresRef,
    updateExpanded,
    setFeatureRefs,
    onFeatureClose,
    updateEmptyTab,
    onFeatureActive,
    onFeatureChange,
    setFeatureGroups,
    onFeatureInactive,
    setFeature:_setFeature,
  })

  const editorCtx:TEditorCtx = useMemo(() => {
    return {
      expanded,
      setFeature,
      rootPrefix,
      menuContext,
      updateFeature,
      updateExpanded,
      feature: (feature || emptyObj) as TRaceFeature,
    }
  }, [
    feature,
    expanded,
    setFeature,
    rootPrefix,
    updateFeature,
    updateExpanded,
  ])

  return (
    <EditorContext.Provider value={editorCtx}>
      <MemoChildren children={children} />
    </EditorContext.Provider>
  )

}
