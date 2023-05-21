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
  TRaceFeatures,
  TGetOpenedTabs,
  TOnFeatureItemCB,
  TRaceContextMenu,
  TUpdateFeatureCB,
  TSetTabsAndGroups,
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
  onFeatureSave:TOnFeatureCB
  onFeatureClose:TOnFeatureCB
  expressionOptions?:TExpOpts
  featureGroups:TRaceFeatures
  onFeatureChange:TOnFeatureCB
  onFeatureActive:TOnFeatureCB
  getOpenedTabs:TGetOpenedTabs
  menuContext?:TRaceContextMenu
  onFeatureInactive:TOnFeatureCB
  onFeatureDelete:TOnFeatureItemCB
  onFeatureCreate:TOnFeatureItemCB
  onFeatureRename:TOnFeatureItemCB
  setFeatureGroups:TSetFeatureGroups
  setTabsAndGroups: TSetTabsAndGroups
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
  collapseAll:() => void
  setFeature:TOnFeatureCB
  featureGroups:TRaceFeatures
  expressionOptions?:TExpOpts
  updateExpanded:TOnExpandedCB
  getOpenedTabs:TGetOpenedTabs
  menuContext?:TRaceContextMenu
  onFeatureChange?:TOnFeatureCB
  updateFeature:TUpdateFeatureCB
  deleteFeature:(loc:string)=>void
  onFolderCreate?:TOnFeatureItemCB
  onFolderDelete?:TOnFeatureItemCB
  onFolderRename?:TOnFeatureItemCB
  setFeatureGroups:TSetFeatureGroups
  setTabsAndGroups: TSetTabsAndGroups
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
    openedTabs,
    curValueRef,
    menuContext,
    featureGroups,
    onFeatureSave,
    getOpenedTabs,
    setOpenedTabs,
    updateEmptyTab,
    onFeatureClose,
    onFeatureChange,
    onFeatureCreate,
    onFeatureDelete,
    onFeatureRename,
    onFeatureActive,
    setFeatureGroups,
    setTabsAndGroups,
    onFeatureInactive,
    expressionOptions,
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
    getOpenedTabs,
    featureGroups,
    setOpenedTabs,
    onFeatureSave,
    onFeatureClose,
    updateExpanded,
    updateEmptyTab,
    onAuditFeature,
    onFeatureRename,
    onFeatureDelete,
    onFeatureActive,
    onFeatureChange,
    onFeatureCreate,
    setFeatureGroups,
    setTabsAndGroups,
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
      getOpenedTabs,
      featureGroups,
      deleteFeature,
      updateFeature,
      updateExpanded,
      onFeatureChange,
      setFeatureGroups,
      setTabsAndGroups,
      collapseAllExcept,
      expressionOptions,
      onFolderRename: onFeatureRename,
      onFolderDelete: onFeatureDelete,
      onFolderCreate: onFeatureCreate,
      feature: (feature || emptyObj) as TRaceFeature,
    }
  }, [
    audit,
    feature,
    expanded,
    setFeature,
    rootPrefix,
    collapseAll,
    getOpenedTabs,
    deleteFeature,
    updateFeature,
    featureGroups,
    updateExpanded,
    onFeatureDelete,
    onFeatureCreate,
    onFeatureChange,
    onFeatureRename,
    setFeatureGroups,
    setTabsAndGroups,
    expressionOptions,
    collapseAllExcept,
  ])

  useGetEditorContext({ editorRef, editorCtx })

  return (
    <EditorContext.Provider value={editorCtx}>
      <MemoChildren children={children} />
    </EditorContext.Provider>
  )

}
