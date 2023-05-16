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
  TFeaturesRef,
  TOnFeatureCB,
  TSetFeatureRefs,
} from './helpers.types'

export enum EEditorMode {
  simple=`simple`,
  advanced=`advanced`
}

export type TFeaturesRefs = {
  stepDefsRef: TStepDefsRef
  featuresRef: TFeaturesRef
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

export type TRaceEditorProps = TEditorShared & {
  mode?:EEditorMode
  rootPrefix: string
  world?:TWorldConfig
  feature?:TRaceFeature
  themeType?:EThemeMode
  settings:TRaceSettings
  definitions:TStepDefsList
  features:TRaceFeatureAsts
  expressionOptions?:TExpOpts
  firstFeatureActive?:boolean
  onFeatureSave?:TOnFeatureCB
  initialFeature?:TRaceFeature
  onWorldChange?:TOnWorldChange
  onFeatureChange?:TOnFeatureCB
  onFeatureCreate?:TOnFeatureCB
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
  onFeatureDelete?:TOnFeatureCB
  menuContext?:TRaceContextMenu
  onFeatureInactive?:TOnFeatureCB
  onSidebarResize?:(width:number) => void
  portal?:string|MutableRefObject<HTMLElement>
  actions?:TEditorAction<TEditorCtx, TEditorRef>[]
  containerRef:MutableRefObject<HTMLElement|undefined>
  onKeyDown?:(event: KeyboardEvent<HTMLElement>) => void
}

export type TEditorContainer = TFeaturesRefs & TEditorRefs & TEditorShared & {
  openedTabs:TTabItem[]
  setFeatureRefs:TSetFeatureRefs
  setOpenedTabs:(tabs:TTabItem[]) => void
}
