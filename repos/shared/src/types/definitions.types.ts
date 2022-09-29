import type { EStepKey } from './features.types'

export enum EDefinitionVariant {
  regex = 'regex',
  expression = 'expression'
}

export type TDefinitionToken = {
  [key:string]: any
}

export type TDefinitionMeta = {
  [key:string]: any
}

export type TDefinitionAst = {
  type: string
  name: string
  uuid: string
  content: string
  meta: TDefinitionMeta
  match: string | RegExp
  tokens: TDefinitionToken[]
  variant: EDefinitionVariant
}

export type TDefinitionsAst = TDefinitionAst[]

export type TDefinitionsTypeMapAst = {
  [key in EStepKey]: TDefinitionsAst
}
