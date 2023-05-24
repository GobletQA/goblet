
import type { MutableRefObject } from 'react'
import type { TAstType, EAstObject } from '@ltipton/parkin'

export enum ERaceDecoType {
  pass=`pass`,
  fail=`fail`,
  spin=`spin`,
  error=`error`,
  success=`success`,
  unknown=`unknown`,
}

export type TAnswerDeco = {
  decorations:TRaceDecoCtx
}

export type TRaceDecoProvider = {
  children:any
  decoRef?:TRaceDecoRef
}

export type TRaceDecoCtx = TRaceDecoFns & {
  decorations?:TRaceDecorations
  setDecorations:TSetDecorations
}


export type TRaceDecoRef = MutableRefObject<TRaceDecoCtx>
export type TRaceDecoRefs = {
  editorRef: TRaceDecoRef
  curPathRef: MutableRefObject<string>
  curValueRef: MutableRefObject<string>
}

export type TRaceDecoMeta = {
  action: `start`|`end`|`test`
}

export type TRaceDecoClear = (location:string) => void
export type TRaceDecoAdd = (
  location:string,
  decoration:TRaceDeco,
  meta:TRaceDecoMeta
) => void

export type TRaceDecoUpdate = (
  location:string,
  decoration:TRaceDeco[],
  meta:TRaceDecoMeta
) => void

export type TGlyphHoverMessage = {
  value: string
  isTrusted: boolean
  supportHtml: boolean
  supportThemeIcons: boolean
}

export type TRaceDecoOpts = {
  zIndex:number
  className:string
  isWholeLine:boolean
  marginClassName:string
  showIfCollapsed:boolean
  glyphMarginClassName:string
  glyphMarginHoverMessage:TGlyphHoverMessage
}

export type TRaceDeco = {
  id: string
  search:string
  type:EAstObject
  options:TRaceDecoOpts
  decoType:ERaceDecoType|`spin`|`pass`|`fail`|`error`
}

export type TRaceDecoFns = {
  add:TRaceDecoAdd
  clear:TRaceDecoClear
  update:TRaceDecoUpdate
}

export type TRaceDecoList = {
  [id:string]: TRaceDeco
}

export type TRaceDecorations = {
  [key:string]: TRaceDecoList
}

export type TSetDecorations = (decorations:TRaceDecorations) => void

export type TDecoCache = {
  feature:string
  cache: Record<string, TAstType>
}