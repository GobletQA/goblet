import type { TFileModel } from './models.types'
import type {
  TStepDef,
  EStepKey,
} from '@ltipton/parkin'

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


export type TDefError = {
  name:string
  message:string
  location:string
}

export type TDefinitionFileModel = Omit<TFileModel, 'ast'> & {
  ast: {
    errors?: TDefError[]
    definitions: TStepDef[]
  }
}

export type TDefinitionFileModelList = Record<string, TDefinitionFileModel>

type ComponentType<T=any, C=any> = (props?:T) => C
export type TItemActionMethod = (item:TStepDef, ...args:any[]) => void
export type TDefItemAction<T=any, C=any> = {
  key:string
  name:string
  Component?: ComponentType<T, C>,
  sx?: Record<string, string|number>
  action?: TItemActionMethod
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

export type TDefGroupList = {
  [EStepKey.when]?: TStepDef[]
  [EStepKey.then]?: TStepDef[]
  [EStepKey.given]?: TStepDef[]
  [EStepKey.and]?: TStepDef[]
  [EStepKey.but]?: TStepDef[]
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

export type TDefLookupMap = Record<string, TStepDef>

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
