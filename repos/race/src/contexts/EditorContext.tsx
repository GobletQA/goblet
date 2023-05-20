import type { MutableRefObject } from 'react'
import type { TExpanded } from '@GBR/hooks/editor/useExpanded'
import type { TTabItem } from '@gobletqa/components'
import type {
  TAudit,
  TExpOpts,
  TEditorRef,
  TFeatureCB,
  TRaceFeature,
  TOnFeatureCB,
  TFeaturesRef,
  TRaceFeatures,
  TSetFeatureRefs,
  TRaceContextMenu,
  TUpdateFeatureCB,
  TOnFolderCreateCB,
  TSetFeatureGroups,
} from '@GBR/types'

import { emptyObj } from '@keg-hub/jsutils'
import { useFeature } from './FeatureContext'
import { MemoChildren } from '@gobletqa/components'
import { useMemo, useContext, createContext } from 'react'
import { useExpanded } from '@GBR/hooks/editor/useExpanded'
import { useAudit } from '@gobletqa/race/hooks/editor/useAudit'
import { useGetEditorContext } from '@GBR/hooks/editor/useGetEditorContext'
import { useFeatureCallbacks } from '@GBR/hooks/features/useFeatureCallbacks'

export type TOnExpandedCB =  (key:string, value?:boolean) => void
export type TEditorProvider = {
  children:any
  rootPrefix:string
  editorRef:TEditorRef
  openedTabs:TTabItem[]
  updateEmptyTab:TFeatureCB
  featuresRef:TFeaturesRef
  onFeatureSave:TOnFeatureCB
  onFeatureClose:TOnFeatureCB
  expressionOptions?:TExpOpts
  featureGroups:TRaceFeatures
  onFeatureChange:TOnFeatureCB
  onFeatureActive:TOnFeatureCB
  onFeatureCreate:TOnFeatureCB
  onFeatureDelete:TOnFeatureCB
  menuContext?:TRaceContextMenu
  onFeatureInactive:TOnFeatureCB
  setFeatureRefs:TSetFeatureRefs
  onFolderCreate?:TOnFolderCreateCB
  editingFeatureGroup:string|boolean
  setFeatureGroups:TSetFeatureGroups
  curPathRef: MutableRefObject<string>
  curValueRef: MutableRefObject<string>
  setOpenedTabs:(tabs:TTabItem[]) => void
}

export type TEditorCtx = {
  audit:TAudit
  rootPrefix:string
  expanded:TExpanded
  displayMeta?:boolean
  feature:TRaceFeature
  setFeature:TOnFeatureCB
  collapseAll:() => void
  featureGroups:TRaceFeatures
  expressionOptions?:TExpOpts
  updateExpanded:TOnExpandedCB
  menuContext?:TRaceContextMenu
  updateFeature:TUpdateFeatureCB
  setFeatureRefs:TSetFeatureRefs
  deleteFeature:(loc:string)=>void
  onFolderCreate?:TOnFolderCreateCB
  setFeatureGroups:TSetFeatureGroups
  editingFeatureGroup:string|boolean
  collapseAllExcept:(key:string|string[]) => void
}

export const EditorContext = createContext<TEditorCtx>({} as TEditorCtx)
export const useEditor = () => useContext(EditorContext)

export const EditorProvider = (props:TEditorProvider) => {
  const {
    children,
    editorRef,
    rootPrefix,
    curPathRef,
    curValueRef,
    openedTabs,
    featuresRef,
    menuContext,
    featureGroups,
    onFeatureSave,
    setOpenedTabs,
    updateEmptyTab,
    onFolderCreate,
    setFeatureRefs,
    onFeatureClose,
    onFeatureChange,
    onFeatureCreate,
    onFeatureDelete,
    onFeatureActive,
    setFeatureGroups,
    onFeatureInactive,
    expressionOptions,
    editingFeatureGroup
  } = props

  const {
    feature,
    setFeature:_setFeature
  } = useFeature()

  const {
    audit,
    onAuditFeature
  } = useAudit({ feature })

  const {
    expanded,
    collapseAll,
    updateExpanded,
    collapseAllExcept
  } = useExpanded()

  const {
    setFeature,
    updateFeature,
    deleteFeature,
  } = useFeatureCallbacks({
    feature,
    expanded,
    rootPrefix,
    curPathRef,
    openedTabs,
    curValueRef,
    featuresRef,
    setOpenedTabs,
    onFeatureSave,
    onFeatureClose,
    setFeatureRefs,
    updateExpanded,
    updateEmptyTab,
    onAuditFeature,
    onFeatureDelete,
    onFeatureActive,
    onFeatureChange,
    onFeatureCreate,
    onFeatureInactive,
    setFeature:_setFeature,
  })

  const editorCtx:TEditorCtx = useMemo(() => {
    return {
      audit,
      expanded,
      setFeature,
      rootPrefix,
      collapseAll,
      menuContext,
      featureGroups,
      deleteFeature,
      updateFeature,
      updateExpanded,
      setFeatureRefs,
      onFolderCreate,
      setFeatureGroups,
      collapseAllExcept,
      expressionOptions,
      editingFeatureGroup,
      feature: (feature || emptyObj) as TRaceFeature,
    }
  }, [
    audit,
    feature,
    expanded,
    setFeature,
    rootPrefix,
    collapseAll,
    deleteFeature,
    updateFeature,
    featureGroups,
    setFeatureRefs,
    updateExpanded,
    onFolderCreate,
    setFeatureGroups,
    expressionOptions,
    collapseAllExcept,
    editingFeatureGroup
  ])

  useGetEditorContext({ editorRef, editorCtx })

  return (
    <EditorContext.Provider value={editorCtx}>
      <MemoChildren children={children} />
    </EditorContext.Provider>
  )

}
