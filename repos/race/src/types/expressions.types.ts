import { Parkin, TStepDef } from '@ltipton/parkin'
import { TRaceStep } from '@GBR/types/features.types'
import type { TPartsMatch, EExpParmKind } from './shared.types'

export type TMatchExpReq = {
  def:TStepDef
  parkin:Parkin
  step:TRaceStep
}

export type TExpPart = TPartsMatch & {
  regex:RegExp
  input:string
  text:string
  type:string
  index: number
  match:string
  defIndex: number
  paramType:string
  example?: string,
  kind?: EExpParmKind
  value?:string|number
  description?: string,
}

export type TMatchExpRes = {
  def:TStepDef
  expressions:TExpPart[]
}