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
  // TO Be Removed once all steps are updated
  race?: boolean
  // TO Be Removed once all steps are updated

  module?:string
  name?:string
  info?:string
  alias?: string[]
  examples?: string[]
  description?:string
  expressions?:TStepMetaExpression[]
}

export type TStepParent = {
  uuid: string
  location: string
}

export type TStepDef = {
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

export type TRaceStepDefs = {
  [key:string]: TStepDef
}

export type TSetSteps = (steps:TRaceStepDefs) => void
