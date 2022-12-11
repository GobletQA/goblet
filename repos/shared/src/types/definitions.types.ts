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

export type TDefinitionMeta = {
  module:string
  description:string
  expressions:string[]
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
  iconProps: {
    size:number,
    Component: ComponentType<any>,
  },
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

export type TDefStepTypeGroups = {
  [EStepKey.when]: TDefGroup
  [EStepKey.then]: TDefGroup
  [EStepKey.given]: TDefGroup
}

export type TDefGroups = TDefStepTypeGroups & {
  all: TDefGroup
  lookup: Record<string, TDefinitionAst>,
}
