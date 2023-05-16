import type { TAuditOpts } from './audit.types'
import type {
  TTagsAst,
  TStepAst,
  TRuleAst,
  TBlockAst,
  TParentAst,
  TBlockType,
  TFeatureAst,
  TScenarioAst,
  TBackgroundAst,
  TStepParentAst,
  TBlockParentAst,
  TScenarioParentAst,
  TBackgroundParentAst,
} from '@ltipton/parkin'


export type TSetFeatureOpts = TAuditOpts & {
  checkInactive?:boolean
}

export type TUpdateFeatureOpts = TSetFeatureOpts & {
  expand?:string
  create?:boolean
  replace?:boolean
}

export type TUpdateFeature = {
  feature: TRaceFeature
  options?:TUpdateFeatureOpts
}

export type TUpdateFeatureCB = (options:TUpdateFeature) => Promise<void>

export type TFeatureParent = {
  uuid: string
  location:string
}

export type TRaceFeatureGroup = {
  uuid:string
  path:string
  title:string
  items:TRaceFeatures
}

export type TEmptyFeature = TRaceFeature & {
  isEmpty:true
  title?:string
}

export type TRaceStep = TStepAst
export type TRaceTags = TTagsAst
export type TRaceRule = TRuleAst
export type TRaceBlock = TBlockAst
export type TRaceScenario = TScenarioAst
export type TRaceBackground = TBackgroundAst

type TOmitFeature = Omit<TFeatureAst, `uuid`>

export type TRaceFeature = TOmitFeature & {
  path:string
  uuid: string
  parent: TFeatureParent
}

export type TRaceFeatureItem = TRaceFeature | TRaceFeatureGroup

export type TRaceFeatures = {
  [key:string]: TRaceFeatureItem
}

export type TRaceFeatureAsts = {
  [key:string]: TRaceFeature
}

export type TRaceStepParent = TStepParentAst
export type TRaceParentAst = TRaceFeature | TParentAst
export type TRaceBlockParent = TRaceFeature | TBlockParentAst
export type TRaceTagsParent = TRaceScenarioParent | TRaceStepParent
export type TRaceScenarioParent = TRaceFeature | TScenarioParentAst
export type TRaceBackgroundParent = TRaceFeature | TBackgroundParentAst
export type TRaceGran = TRaceFeature | TRaceRule | TFeatureAst

export type TRaceAst = TRaceRule
  | TRaceTags
  | TRaceStep
  | TRaceBlock
  | TRaceScenario
  | TRaceFeature
  | TRaceBackground


export {
  TBlockType
}
