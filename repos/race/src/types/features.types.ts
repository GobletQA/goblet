import type {
  TRuleAst,
  TAstBlock,
  TScenarioAst,
  TBackgroundAst,
} from './shared.types'

export enum EMetaType {
  tags=`tags`,
  role=`role`,
  persona=`persona`,
  reason=`reason`,
  desire=`desire`,
  perspective=`perspective`,
}

export type TStepParentAst = TBackgroundAst | TScenarioAst
export type TScenarioParentAst = TRuleAst | TRaceFeature
export type TTagsParentAst = TScenarioParentAst | TStepParentAst

export type TFeatureParent = {
  uuid: string
  location:string
}

export type TRaceFeatureGroup = {
  uuid:string
  path:string
  title:string
  items: TRaceFeatures
}

export type TRaceFeature = {
  uuid: string
  path:string
  tags?: string[]
  feature: string
  content: string
  empty?: boolean
  reason?: TAstBlock
  desire?: TAstBlock
  rules?: TRuleAst[]
  comments: TAstBlock[]
  parent: TFeatureParent
  perspective?: TAstBlock
  scenarios: TScenarioAst[]
  background?: TBackgroundAst
  
}

export type TRaceFeatureItem = TRaceFeature | TRaceFeatureGroup

export type TRaceFeatures = {
  [key:string]: TRaceFeatureItem
}

export type TRaceFeatureAsts = {
  [key:string]: TRaceFeature
}


export type TEmptyFeature = {
  uuid?: string
  path?:string
  title?:string
  tags?: string[]
  feature?: string
  content?: string
  reason?: TAstBlock
  desire?: TAstBlock
  rules?: TRuleAst[]
  comments?: TAstBlock[]
  parent?: TFeatureParent
  perspective?: TAstBlock
  scenarios?: TScenarioAst[]
  background?: TBackgroundAst
}

export type TUpdateFeature = {
  replace?:boolean
  feature: TRaceFeature
}