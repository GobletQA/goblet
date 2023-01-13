import type { TFileModel } from './models.types'

export enum EAstObjects {
  feature = `feature`,
  rule = `rule`,
  background = `background`,
  scenario = `scenario`,
  step = `step`
}

export enum EStepKey {
  given=`given`,
  when=`when`,
  then=`then`,
  and=`and`,
  but=`but`,
} 

export type TBackgroundAst = {
  index: number
  uuid?: string
  tags: string[]
  background: string
  scenarios: TScenarioAst[]
}

export type TRuleAst = {
  index: number
  uuid?: string
  tags: string[]
  rule: string
  background?: TBackgroundAst
  scenarios: TScenarioAst[]
}

export type TStepAst = {
  uuid?: string
  index: number
  step: string
  type: EStepKey
}

export type TScenarioAst = {
  index: number
  uuid?: string
  tags: string[]
  scenario: string
  steps: TStepAst[]
}


export type TAstBlock = {
  content: string
  index: number
}

export type TFeatureAst = {
  index?: number
  tags: string[]
  uuid?: string
  feature: string
  content: string
  reason?: TAstBlock
  desire?: TAstBlock
  comments: TAstBlock[]
  perspective?: TAstBlock
  background?: TBackgroundAst
  rules?: TRuleAst[]
  scenarios: TScenarioAst[]
}

export type TAstType = TFeatureAst | TRuleAst | TBackgroundAst | TScenarioAst | TStepAst

export type TFeatureFileModel = Omit<TFileModel, 'ast'> & {
  ast: TFeatureAst|TFeatureAst[]
}

export type TFeatureFileModelList = Record<string, TFeatureFileModel>
