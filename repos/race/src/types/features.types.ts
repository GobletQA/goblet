import type {
  TStepAst,
  TRuleAst,
  TFeatureAst,
  TScenarioAst,
  TBackgroundAst,
} from '@ltipton/parkin'

import type { EUpdateType } from './helpers.types'
import type { ESectionType } from './section.types'

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
  items:TRaceFeatures
}

export type TRaceSteps = Omit<TStepAst, `uuid`|`index`> & {
  index:number
  uuid:string
}

export type TRaceBackground = Omit<TBackgroundAst, `uuid`|`index`|`steps`> & {
  index:number
  uuid: string
  steps:TRaceSteps[]
}

export type TRaceScenario = Omit<TScenarioAst, `uuid`|`index`|`steps`> & {
  index:number
  uuid: string
  steps: TRaceSteps[]
}

export type TRaceRule = Omit<TRuleAst, `uuid`|`index`|`scenarios`|`background`> & {
  index:number
  uuid: string
  scenarios: TRaceScenario[]
  background?:TRaceBackground
}

export type TRaceFeature = Omit<TFeatureAst, `uuid`|`background`|`rules`|`scenarios`> & {
  path:string
  uuid: string
  rules?:TRaceRule[]
  parent: TFeatureParent
  scenarios:TRaceScenario[]
  background?:TRaceBackground
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

export type TUpdateFeatureOpts = {
  op?:EUpdateType
  path?:string
  index?:number
  replace?:boolean
  type?:ESectionType
}

export type TUpdateFeature = TUpdateFeatureOpts & {
  feature: TRaceFeature
}