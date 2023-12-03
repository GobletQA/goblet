import type { TOpenMode, IEditorUpdateOpts } from './helpers.types'

export interface TFilelist {
  [key: string]: string | null
}

export type TFileMeta = {
  path:string
  status?:string
  mode?:TOpenMode
  editor?:IEditorUpdateOpts
}

export type TFileMetas = TFileMeta[]

export type TMFile = {
  ext:string
  uuid:string
  name:string
  content:string
  location:string
  relative:string
}
export type TMFiles = {
  [key:string]:TMFile
}

export type TBuildFile = {
  ext?:string
  part:string
  key:string
  rootPrefix?:string
  content:string|null
}

export type TBuildFolder = {
  part:string
  name?:string
  path?:string
  paths:string[]
  index:number
  children?: TFolderChildren
}

export type TFolder = {
  path:string,
  name:string,
  _isDirectory:boolean,
  children: TFolderChildren,
}

export type TRootDir = {
  path:string,
  isDirectory:boolean,
  children: TFolderChildren,
}

export type TFile = {
  ext:string
  path:string
  name:string
  content:string|null
  uuid?:string
  location?:string
  relative?:string
}

export type TFolderChildren = Record<string, TFileItem>

export type TFolderItem = TRootDir | TFolder
export type TFileItem = TRootDir | TFolder | TFile
export type TItem = TFolder | TFile