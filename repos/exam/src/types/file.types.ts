import {TExArrClsOptMap} from "./helpers.types"

export type TExAst=Record<any, any>
export type TExFileAst=TExAst|TExFileModelDef

export type TExFileModelDef = {
  ast?: TExAst,
  ext: string
  name: string
  content: string
  location: string
  fileType: string
  transformed?:any
}

export type TExFileModelAst<A extends TExAst=TExAst> = {
  ast?: A,
  ext: string
  name: string
  content: string
  location: string
  fileType: string
  transformed?:any
}

export type TExFileModelOverride<T extends Partial<TExFileModelDef>=TExFileModelDef> = T

export type TExFileModel<T extends TExFileAst=TExFileAst> = TExFileModelOverride<T>
  | TExFileModelAst<T>
  | TExFileModelDef


export type TExFileLoaded<T extends TExFileAst=TExFileAst> = {
  loc?:string
  type?:string
  content?:string
  file?:TExFileModel<T>
}


export type TTypeFromFileMap<T=any> = {
  [Key:string]: TExArrClsOptMap<T>
}