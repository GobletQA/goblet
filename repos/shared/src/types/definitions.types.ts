import type { EStepKey } from './features.types'
import type { TFileModel } from './models.types'

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

export type TDefinitionParent = {
  uuid: string
  location: string
}

export type TDefinitionAst = {
  type: string
  name: string
  uuid: string
  content: string
  meta: TDefinitionMeta
  match: string | RegExp
  parent?: TDefinitionParent
  tokens: TDefinitionToken[]
  variant: EDefinitionVariant
}

export type TDefinitionsAstList = Record<string, TDefinitionAst>
export type TDefinitionsAstArr = TDefinitionAst[]

export type TDefinitionsAstTypeMap = {
  [key in EStepKey]: TDefinitionsAstArr
}

export type TDefinitionFileModel = Omit<TFileModel, 'ast'> & {
  ast: TDefinitionAst
}