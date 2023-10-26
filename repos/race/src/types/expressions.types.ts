import { EExpParmType, Parkin, TStepDef } from '@ltipton/parkin'
import { TRaceStep } from '@GBR/types/features.types'
import type { TPartsMatch } from './shared.types'

export type TMatchExpReq = {
  def:TStepDef
  parkin:Parkin
  step:TRaceStep
}

export type TExpPart = TPartsMatch & {
  regex:RegExp
  input:string
  text:string
  index: number
  match:string
  kind?: string
  label?:string
  decor?:boolean
  defIndex:number
  example?:string
  value?:string|number
  description?:string
  paramType:EExpParmType
  kindRef?:string|string[]
  options?:string[]|number[]
}

export type TMatchExpRes = {
  def:TStepDef
  expressions:TExpPart[]
}