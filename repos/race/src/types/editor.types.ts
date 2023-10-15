import type { TExpPart } from './expressions.types'
import type { TRaceContextMenu } from './menu.types'
import type { TAutoOpt } from '@gobletqa/components'
import type { TRaceSettings } from './settings.types'
import type { TEditorCtx } from '@GBR/contexts/EditorContext'
import type { TStepDef, TWorldConfig, TStepDefsList } from '@ltipton/parkin'
import type { KeyboardEvent, MutableRefObject, ComponentType } from 'react'
import type {
  TTabItem,
  TTabAction,
  EThemeMode,
  TSidebarPanel,
  TEditorAction,
} from '@gobletqa/components'

import type {
  TRaceStep,
  TRaceFeature,
  TRaceFeatures,
  TRaceStepParent,
  TRaceFeatureAsts,
} from './features.types'

import type {
  TStepDefsRef,
  TOnFeatureCB,
  TSetFeatureGroups,
  TOnFeatureItemCB,
} from './helpers.types'

import type {
  TOnSettingCB
} from './settings.types'

import type {
  TRaceDecoRef
} from './decorations.types'

import type { TRaceMenuActions } from './menu.types'

export type TFeatureLoc = string

export type TOpenedFeatures = TFeatureLoc[]

export type TFeaturesRefs = {
  stepDefsRef: TStepDefsRef
}

export type TEditorRef = MutableRefObject<TEditorCtx>
export type TEditorRefs = {
  editorRef: TEditorRef
  curPathRef: MutableRefObject<string>
  curValueRef: MutableRefObject<string>
}

export type TGetExpProps = {
  def:TStepDef
  step:TRaceStep
  expression:TExpPart
  parent:TRaceStepParent
}
export type TGetExpressionCB = (props:TGetExpProps) => TAutoOpt[]|undefined

export type TExpOpts = TAutoOpt[]|TGetExpressionCB

export type TWorldChange = {
  world:TWorldConfig
  replace?:boolean
}

export type TOnWorldChange = (props:TWorldChange) => void

export type TRaceInternal = TRaceEditorProps & {
  initialFeature?:TRaceFeature
}

export type TRaceEditorProps = TEditorShared & {
  rootPrefix: string
  world?:TWorldConfig
  decoRef?:TRaceDecoRef
  themeType?:EThemeMode
  editorRef?:TEditorRef
  feature?:TRaceFeature
  settings:TRaceSettings
  definitions:TStepDefsList
  features:TRaceFeatureAsts
  expressionOptions?:TExpOpts
  firstFeatureActive?:boolean
  onFeatureSave?:TOnFeatureCB
  onWorldChange?:TOnWorldChange
  onFeatureChange?:TOnFeatureCB
  onSettingChange?:TOnSettingCB
  openedFeatures?:TOpenedFeatures
  onFeatureCreate?:TOnFeatureItemCB
}

export type TEditorShared = TRaceMenuActions & {
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
  onFeatureInactive?:TOnFeatureCB
  onFeatureRename?:TOnFeatureItemCB
  onFeatureDelete?:TOnFeatureItemCB
  onSidebarResize?:(width:number) => void
  portal?:string|MutableRefObject<HTMLElement>
  actions?:TEditorAction<TEditorCtx, TEditorRef>[]
  containerRef:MutableRefObject<HTMLElement|undefined>
  onKeyDown?:(event: KeyboardEvent<HTMLElement>) => void
}

export type TEditorContainer = TEditorRefs & TEditorShared & {
  openedTabs:TTabItem[]
  setFeatureGroups:TSetFeatureGroups
  setOpenedTabs:(tabs:TTabItem[]) => void
}
