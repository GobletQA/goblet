export enum EStepVariant {
  regex = 'regex',
  expression = 'expression'
}

export type TStepToken = {
  [key:string]: any
}

export type TStepMetaExpression = {
  type: string,
  example: string,
  description: string,
}

export type TStepMeta = {
  module?:string
  examples?: string[]
  description?:string
  expressions?:TStepMetaExpression[]
}

export type TStepParent = {
  uuid: string
  location: string
}

export type TStep = {
  type: string
  name: string
  uuid: string
  content: string
  location?: string,
  meta: TStepMeta
  match: string | RegExp
  parent?: TStepParent
  tokens: TStepToken[]
  // variant: EStepVariant.expression
}

export type TRaceSteps = {
  [key:string]: TStep
}