import type { TFeatureAst } from './features.types'
import type { TDefinitionsAst } from './definitions.types'

export type TGeneralAst = Record<any, any>

export type TChildTreeNode = {
  id: string
  name: string
  type: string
  fileType: string
  children: TTreeNodeModel[],
  location: string
}

export type TTreeNodeModel = {
  id: string
  name: string
  type: string
  fileType: string
  children: TChildTreeNode[],
  location: string
}

export type TFileModel = {
  name: string
  ext: string
  location: string
  relative: string
  content: string
  fileType: string
  mime: string
  ast: TGeneralAst,
  lastModified: number,
  uuid: string
}

export type TScreenModel = {
  id: string
  title: string
  View?: (...args:any[]) => any,
  activeFile?: TFileModel,
  active: boolean,
  fileTypes: string[],
}

export type TTestsModel = {
  features: TFileModel[],
  definitions: TFileModel[],
  // What is this?
  jest: TFileModel[],
  unit: TFileModel[],
  waypoint: TFileModel[],
}

export type TCmdMessage = {
  [key:string]:  any
}

export type TTestRunModel = {
  file: string
  fileType: string
  lastRun: string
  exitCode: number | undefined,
  failed: boolean,
  active: boolean,
  running: boolean,
  command: string | undefined,
  params: string[],
  messages: Record<string, TCmdMessage>,
}


export type TFeatureFileModel = Omit<TFileModel, 'ast'> & {
  ast: TFeatureAst
}

export type TDefinitionFileModel = Omit<TFileModel, 'ast'> & {
  ast: TDefinitionsAst
}

