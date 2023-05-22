
import type { MutableRefObject } from 'react'

export enum ERaceDecoType {
  pass=`pass`,
  fail=`fail`,
  spin=`spin`,
  error=`error`,
  success=`success`,
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
  decoration:TRaceDecoList,
  meta:TRaceDecoMeta
) => void

export type TRaceDecoOpts = {
  [k: string]: any
}

export type TRaceDeco = {
  id: string
  options?: TRaceDecoOpts
  type: ERaceDecoType|`spin`|`pass`|`fail`|`error`
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

