import type { MutableRefObject } from 'react'
import type { TFeatureUIOverride }  from './FeatureContext'
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
  TRaceMenuActions,
  TRaceContextMenu,
  TUpdateFeatureCB,
  TSetTabsAndGroups,
  TSetFeatureGroups,
  TOnAuditFeatureCB,
} from '@GBR/types'

import { useWorld } from './WorldContext'
import { emptyObj } from '@keg-hub/jsutils'
import { useFeature } from './FeatureContext'
import { MemoChildren } from '@gobletqa/components'
import { useMemo, useContext, createContext } from 'react'
import { useExpanded } from '@GBR/hooks/editor/useExpanded'
import { useAudit } from '@gobletqa/race/hooks/editor/useAudit'
import { useGetEditorContext } from '@GBR/hooks/editor/useGetEditorContext'
import { useFeatureCallbacks } from '@GBR/hooks/features/useFeatureCallbacks'

export type TOnExpandedCB =  (key:string, value?:boolean) => void
export type TEditorProvider = TRaceMenuActions & {
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

export type TEditorCtx = TRaceMenuActions & {
  audit:TAudit
  rootPrefix:string
  expanded:TExpanded
  isAuditing?:boolean
  displayMeta?:boolean
  feature:TRaceFeature
  collapseAll:() => void
  resetParkin:() => void
  setFeature:TOnFeatureCB
  featureGroups:TRaceFeatures
  expressionOptions?:TExpOpts
  updateExpanded:TOnExpandedCB
  getOpenedTabs:TGetOpenedTabs
  menuContext?:TRaceContextMenu
  onFeatureChange?:TOnFeatureCB
  updateFeature:TUpdateFeatureCB
  onAuditFeature:TOnAuditFeatureCB
  deleteFeature:(loc:string)=>void
  onFolderCreate?:TOnFeatureItemCB
  onFolderDelete?:TOnFeatureItemCB
  onFolderRename?:TOnFeatureItemCB
  setFeatureGroups:TSetFeatureGroups
  setTabsAndGroups: TSetTabsAndGroups
  overrideFeatureUI:TFeatureUIOverride
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
    stepActions,
    ruleActions,
    featureActions,
    scenarioActions,
    backgroundActions,
  } = props

  const {
    resetParkin
  } = useWorld()

  const {
    feature,
    overrideFeatureUI,
    setFeature:_setFeature
  } = useFeature()

  const {
    audit,
    isAuditing,
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
      isAuditing,
      rootPrefix,
      collapseAll,
      resetParkin,
      menuContext,
      getOpenedTabs,
      featureGroups,
      deleteFeature,
      updateFeature,
      updateExpanded,
      onAuditFeature,
      onFeatureChange,
      setFeatureGroups,
      setTabsAndGroups,
      collapseAllExcept,
      expressionOptions,
      stepActions,
      ruleActions,
      featureActions,
      scenarioActions,
      backgroundActions,
      overrideFeatureUI,
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
    isAuditing,
    collapseAll,
    resetParkin,
    getOpenedTabs,
    deleteFeature,
    updateFeature,
    featureGroups,
    updateExpanded,
    onAuditFeature,
    onFeatureDelete,
    onFeatureCreate,
    onFeatureChange,
    onFeatureRename,
    setFeatureGroups,
    setTabsAndGroups,
    expressionOptions,
    collapseAllExcept,
    stepActions,
    ruleActions,
    featureActions,
    scenarioActions,
    backgroundActions,
  ])

  useGetEditorContext({ editorRef, editorCtx })

  return (
    <EditorContext.Provider value={editorCtx}>
      <MemoChildren children={children} />
    </EditorContext.Provider>
  )

}
