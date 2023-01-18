import type { editor, Range } from 'monaco-editor'

export type TDecorationMeta = {
  action: `start`|`end`|`test`
}

export type TDecorationCB = (...args:any[]) => void
export type TDecorationAdd = (
  location:string,
  decoration:TDecoration,
  meta:TDecorationMeta
) => void

export type TDecorationUpdate = (
  location:string,
  decoration:TDecoration,
  meta:TDecorationMeta
) => void

export type TDecoration = {
  range?: Range
  search?: string
  options: editor.IModelDecorationOptions
}

export type TDecorationFns = {
  add:TDecorationAdd
  clear:TDecorationCB
  remove:TDecorationCB
  update:TDecorationUpdate
}


export type TDecorationList = {
  [key:string]: editor.IModelDeltaDecoration
}

export type TDecorationFiles = {
  [key:string]: TDecorationList
}
