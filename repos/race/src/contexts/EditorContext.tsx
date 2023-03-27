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
import type { MutableRefObject } from 'react'

import {
  useMemo,
  useState,
  useContext,
  useCallback,
  createContext,
} from 'react'

import { useFeature } from './FeatureContext'
import { MemoChildren } from '@gobletqa/components'
import { emptyObj, emptyArr, exists, ensureArr } from '@keg-hub/jsutils'
import { useGetEditorContext } from '@GBR/hooks/editor/useGetEditorContext'
import { useFeatureCallbacks } from '@GBR/hooks/features/useFeatureCallbacks'

export type TExpanded = Record<string, boolean>
export type TOnExpandedCB =  (key:string, value?:boolean) => void
export type TEditorProvider = {
  children:any
  rootPrefix:string
  updateEmptyTab:TFeatureCB
  featuresRef: TFeaturesRef
  onFeatureSave:TOnFeatureCB
  onFeatureClose:TOnFeatureCB
  onFeatureChange:TOnFeatureCB
  onFeatureActive:TOnFeatureCB
  menuContext?:TRaceContextMenu
  onFeatureInactive:TOnFeatureCB
  setFeatureRefs:TSetFeatureRefs
  setFeatureGroups:TSetFeatureGroups
  curPathRef: MutableRefObject<string>
  curValueRef: MutableRefObject<string>
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
  collapseAll: () => void
  collapseAllExcept:(key:string|string[]) => void
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

  const collapseAllExcept = useCallback((key:string|string[]) => {
    const keep = ensureArr(key)
    const updated:TExpanded = {}

    Object.keys(expanded).forEach(key => (updated[key] = keep.includes(key) ? true : false))

    setExpanded(updated)
  }, [expanded])
  
  const collapseAll = useCallback(() => setExpanded({}), [expanded])

  return {
    expanded,
    setExpanded,
    collapseAll,
    updateExpanded,
    collapseAllExcept
  }
}


export const EditorProvider = (props:TEditorProvider) => {
  const {
    children,
    rootPrefix,
    curPathRef,
    curValueRef,
    featuresRef,
    menuContext,
    updateEmptyTab,
    setFeatureRefs,
    onFeatureSave,
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

  const {
    expanded,
    collapseAll,
    updateExpanded,
    collapseAllExcept
  } = useExpanded()

  const {
    setFeature,
    updateFeature,
  } = useFeatureCallbacks({
    feature,
    expanded,
    rootPrefix,
    curPathRef,
    curValueRef,
    featuresRef,
    onFeatureSave,
    onFeatureClose,
    setFeatureRefs,
    updateExpanded,
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
      collapseAll,
      menuContext,
      updateFeature,
      updateExpanded,
      collapseAllExcept,
      feature: (feature || emptyObj) as TRaceFeature,
    }
  }, [
    feature,
    expanded,
    setFeature,
    rootPrefix,
    collapseAll,
    updateFeature,
    updateExpanded,
    collapseAllExcept,
  ])

  useGetEditorContext({ editor: editorCtx })

  return (
    <EditorContext.Provider value={editorCtx}>
      <MemoChildren children={children} />
    </EditorContext.Provider>
  )

}
