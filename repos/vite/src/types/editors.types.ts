import type { TRaceDeco } from '@gobletqa/race'
import type { EEditorType } from './app.types'
import type { TDecoration } from '@gobletqa/monaco'
import type { TPlayerEventData } from './shared.types'

export type TBuiltDeco = TDecoration | TRaceDeco

export type TBuildDecoration<A=any> = {
  ast?:A
  uuid?:string
  type?:string
  testPath?:string
  editor:EEditorType
  description?:string
  event:TPlayerEventData
}
