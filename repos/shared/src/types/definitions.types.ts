import type { ComponentType } from 'react'
import type { EStepKey } from './features.types'
import type { TFileModel } from './models.types'

export enum EDefinitionVariant {
  regex = 'regex',
  expression = 'expression'
}

export type TDefinitionToken = {
  [key:string]: any
}

export type TDefinitionMetaExpression = {
  type: string,
  example: string,
  description: string,
}

export type TDefinitionMeta = {
  module?:string
  examples?: string[]
  description?:string
  expressions?:TDefinitionMetaExpression[]
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
  location?: string,
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
  ast: Record<`definitions`, TDefinitionAst[]>
}

export type TDefItemAction = {
  key:string
  name:string
  Component?: ComponentType<any>,
  sx?: Record<string, string|number>
  action?: (item:TDefItemAction|TDefinitionAst, ...args:any[]) => void
}

export type TDefGroupItem = {
  title:string
  uuid:string
  meta: TDefinitionMeta
  actions: TDefItemAction[]
}

export type TDefGroup = {
  type: string
  group: string
  toggled: boolean,
  items: TDefGroupItem[]
}

export type TDefGroupType = EStepKey.when | EStepKey.then | EStepKey.given

export type TDefTypeGroup = {
  [EStepKey.when]: TDefGroup
  [EStepKey.then]: TDefGroup
  [EStepKey.given]: TDefGroup
}

export type TAllDefGroup = {
  all: TDefGroup
}

export type TDefLookupMap = Record<string, TDefinitionAst>

export type TDefGroupTypes = {
  allDefs: TDefGroups
  lookup: TDefLookupMap
  customDefs: TDefGroups
  defaultDefs: TDefGroups
}

export type TDefGroups = {
  all?: TDefGroup
  [EStepKey.when]?: TDefGroup
  [EStepKey.then]?: TDefGroup
  [EStepKey.given]?: TDefGroup
}
