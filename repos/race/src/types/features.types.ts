import type {
  TRuleAst,
  TFeatureAst,
  TScenarioAst,
  TBackgroundAst,
} from '@ltipton/parkin'

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
export type TBackgroundParentAst = TRaceFeature | TRuleAst

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

export type TRaceFeature = Omit<TFeatureAst, `uuid`> & {
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


export type TEmptyFeature = TRaceFeature & {
  isEmpty:true
  title?:string
}

export type TUpdateFeature = {
  replace?:boolean
  feature: TRaceFeature
}