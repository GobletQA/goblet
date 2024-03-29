import type { TFileModel } from './models.types'
import type { TFeatureFileModel } from './features.types'

export type TGFileType = {
  ext: string
  type:string
  location:string
}

export type TGFileTypes = {
  [key:string]: TGFileType
}

export type TFileTree = Record<string, TFileModel|TFeatureFileModel|null>

export type TFileType = {
  ext: string
  type: string
  location: string
  typeInName?: boolean
}

export type TFileTypes = Record<string, TFileType>

export type TRootPaths = {
  [k: string]: null | TRootPaths
}
