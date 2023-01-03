
export enum EAstObjects {
  feature = 'feature',
  rule = 'rule',
  background = 'background',
  scenario = 'scenario',
  step = 'step'
}

export enum EStepKey {
  given=`given`,
  when=`when`,
  then=`then`,
  and=`and`,
  but=`but`,
}

export enum EMetaType {
  tags=`tags`,
  role=`role`,
  persona=`persona`,
  reason=`reason`,
  desire=`desire`,
  perspective=`perspective`,
}

export type TBackgroundAst = {
  index: number
  uuid: string
  tags: string[]
  background: string
  steps: TStepAst[]
}

export type TRuleAst = {
  index: number
  uuid: string
  tags: string[]
  rule: string
  background?: TBackgroundAst
  scenarios: TScenarioAst[]
}

export type TStepAst = {
  uuid: string
  index: number
  step: string
  type: EStepKey
}

export type TScenarioAst = {
  index: number
  uuid: string
  tags: string[]
  scenario: string
  steps: TStepAst[]
}

export type TStepParentAst = TBackgroundAst | TScenarioAst
export type TScenarioParentAst = TRuleAst | TRaceFeature
export type TTagsParentAst = TScenarioParentAst | TStepParentAst

export type TAstBlock = {
  content: string
  index: number
}

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
