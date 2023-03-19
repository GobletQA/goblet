import type {
  TTagsAst,
  EStepType,
  TStepAst,
  TRuleAst,
  TBlockAst,
  TFeatureAst,
  TScenarioAst,
  TBackgroundAst,
} from '@ltipton/parkin'

import type { TRaceIndex } from './indexed.types'
import type { EPatchType } from './helpers.types'
import type { ESectionType } from './section.types'

export type TPatchParams = {
  op?:EPatchType
  path?:string
  index?:number
  replace?:boolean
  type?:ESectionType
}

export type TUpdateFeature = {
  indexes?: TRaceIndex
  feature: TRaceFeature
  options?:TPatchParams
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

export type TBlockType = ESectionType.block
  | ESectionType.empty
  | ESectionType.comment
  | ESectionType.desire
  | ESectionType.reason
  | ESectionType.perspective

export type TRaceTags = Omit<TTagsAst, `type`> & {
  type: ESectionType.tags
}

export type TRaceBlock = Omit<TBlockAst, `type`> & {
  type: TBlockType
}

export type TRaceStep = Omit<TStepAst,`type`> & {
  index:number
  uuid:string
  type:ESectionType.step | EStepType
}

export type TRaceBackground = Omit<TBackgroundAst,`steps`|`type`|`tags`> & {
  index:number
  uuid: string
  tags: TRaceTags
  steps:TRaceStep[]
  type:ESectionType.background
}

export type TRaceScenario = Omit<TScenarioAst,`steps`|`type`|`tags`> & {
  index:number
  uuid: string
  tags: TRaceTags
  steps: TRaceStep[]
  type:ESectionType.scenario
}

export type TRaceRule = Omit<TRuleAst,`scenarios`|`background`|`type`|`tags`> & {
  index:number
  uuid: string
  tags: TRaceTags
  type:ESectionType.rule
  scenarios: TRaceScenario[]
  background?:TRaceBackground
}

type TOmitFeature = Omit<TFeatureAst,
  `uuid`
    | `background`
    | `rules`
    | `scenarios`
    | `desire`
    | `empty`
    | `comments`
    | `perspective`
    | `reason`
    | `type`
    | `tags`
>

export type TRaceFeature = TOmitFeature & {
  path:string
  uuid: string
  tags: TRaceTags
  rules?:TRaceRule[]
  parent: TFeatureParent
  scenarios:TRaceScenario[]
  type:ESectionType.feature
  background?:TRaceBackground
  reason?: TRaceBlock|TRaceBlock[]
  desire?:TRaceBlock
  empty?:TRaceBlock[]
  comments?:TRaceBlock[]
  perspective?:TRaceBlock
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
export type TRaceBlockParent = TRaceFeature | TRaceRule | TRaceBackground | TRaceScenario
export type TRaceParentAst = TRaceFeature | TRaceRule | TRaceBackground | TRaceScenario

export type TRaceAst = TRaceRule
  | TRaceTags
  | TRaceStep
  | TRaceBlock
  | TRaceScenario
  | TRaceFeature
  | TRaceBackground
