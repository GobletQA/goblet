import type { TSettingsState } from './settings.types'
import type { TRaceContextMenu } from './menu.types'
import type { TWorldConfig, TStepDefsList } from '@ltipton/parkin'
import type { TRaceFeatureAsts, TRaceFeatures, TRaceFeature } from './features.types'
import type { KeyboardEvent, RefObject, MutableRefObject, ComponentType } from 'react'
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

export type TRaceEditorProps = TSettingsState & TEditorShared & {
  world?:TWorldConfig
  steps:TStepDefsList
  rootPrefix: string
  feature?:TRaceFeature
  themeType?:EThemeMode
  features:TRaceFeatureAsts
  firstFeatureActive?:boolean
  initialFeature?:TRaceFeature
  onFeatureSave?:TOnFeatureCB
  onFeatureClose?:TOnFeatureCB
  onFeatureChange?:TOnFeatureCB
  onFeatureActive?:TOnFeatureCB
  onFeatureInactive?:TOnFeatureCB
}

export type TEditorShared = {
  onTabDown?:TTabAction
  onTabLeave?:TTabAction
  onTabHover?:TTabAction
  actionsOpen?:boolean
  sidebarWidth?:number
  sidebarStatus?:boolean
  sidebarMaxWidth?:number
  Panels?:TSidebarPanel[]
  PrePanels?:TSidebarPanel[]
  Divider?:ComponentType<any>
  featureGroups:TRaceFeatures
  onFeatureClose?:TOnFeatureCB
  onFeatureActive?:TOnFeatureCB
  menuContext?:TRaceContextMenu
  onSidebarResize?:(width:number) => void
  portal?:string|MutableRefObject<HTMLElement>
  actions?:TEditorAction<TRaceEditor, TEditorRef>[]
  containerRef:MutableRefObject<HTMLElement|undefined>
  onKeyDown?:(event: KeyboardEvent<HTMLElement>) => void
}

export type TEditorContainer = TFeaturesRefs & TEditorRefs & TEditorShared & {
  openedTabs:TTabItem[]
  setOpenedTabs:(tabs:TTabItem[]) => void
}
