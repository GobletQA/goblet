import type { TSettingsState } from './settings.types'
import type { TRaceContextMenu } from './menu.types'
import type { TWorldConfig, TStepDefsList } from '@ltipton/parkin'
import type { RefObject, MutableRefObject, ComponentType } from 'react'
import type { TRaceFeatureAsts, TRaceFeatures, TRaceFeature } from './features.types'
import type {
  TTabItem,
  TTabAction,
  EThemeMode,
  TSidebarPanel,
  TEditorAction,
} from '@gobletqa/components'

import type {
  TStepDefsRef,
  TFeaturesRef,
  TOnFeatureCB,
  TOnReturnFeatureCB
} from './helpers.types'

export type TRaceEditor = {
  [key:string]: any
}

export type TFeaturesRefs = {
  stepDefsRef: TStepDefsRef
  featuresRef: TFeaturesRef
}

export type TEditorRef = RefObject<TRaceEditor>

export type TEditorRefs = {
  editorRef: TEditorRef
  curPathRef: MutableRefObject<string>
  curValueRef: MutableRefObject<string>
}

export type TRaceEditorProps = TSettingsState & TEditorContainer & {
  world?:TWorldConfig
  steps:TStepDefsList
  rootPrefix: string
  feature?:TRaceFeature
  themeType?:EThemeMode
  features:TRaceFeatureAsts
  firstFeatureActive?:boolean
  initialFeature?:TRaceFeature
  onFeatureClose?:TOnFeatureCB
  onFeatureChange?:TOnFeatureCB
  onFeatureActive?:TOnFeatureCB
  onFeatureInactive?:TOnFeatureCB
  onBeforeFeatureChange?:TOnReturnFeatureCB
}

export type TEditorContainer = TFeaturesRefs & TEditorRefs & {
  actionsOpen?:boolean
  sidebarWidth?:number
  sidebarStatus?:boolean
  sidebarMaxWidth?:number
  openedTabs:TTabItem[]
  onTabDown?:TTabAction
  onTabLeave?:TTabAction
  onTabHover?:TTabAction
  Panels?:TSidebarPanel[]
  onCloseFeature:TTabAction
  onActiveFeature:TTabAction
  PrePanels?:TSidebarPanel[]
  Divider?:ComponentType<any>
  featureGroups:TRaceFeatures
  menuContext?:TRaceContextMenu
  onSidebarResize?:(width:number) => void
  portal?:string|MutableRefObject<HTMLElement>
  actions?:TEditorAction<TRaceEditor, TEditorRef>[]
}