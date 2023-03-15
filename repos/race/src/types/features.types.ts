import type {
  TStepAst,
  TRuleAst,
  TAstBlock,
  TFeatureAst,
  TScenarioAst,
  TBackgroundAst,
} from '@ltipton/parkin'

import type { EUpdateType } from './helpers.types'
import type { ESectionType } from './section.types'

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

export type TRaceBlock = TAstBlock

export type TRaceStep = Omit<TStepAst, `uuid`|`index`> & {
  index:number
  uuid:string
}

export type TRaceBackground = Omit<TBackgroundAst, `uuid`|`index`|`steps`> & {
  index:number
  uuid: string
  steps:TRaceStep[]
}

export type TRaceScenario = Omit<TScenarioAst, `uuid`|`index`|`steps`> & {
  index:number
  uuid: string
  steps: TRaceStep[]
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

export type TRaceStepParent = TRaceBackground | TRaceScenario
export type TRaceScenarioParent = TRaceRule | TRaceFeature
export type TRaceTagsParent = TRaceScenarioParent | TRaceStepParent
export type TRaceBackgroundParent = TRaceFeature | TRaceRule