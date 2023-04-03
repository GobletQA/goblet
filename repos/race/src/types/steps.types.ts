import type { TStepDefsList } from '@ltipton/parkin'
import type { TPartsMatch, EExpParmKind } from './shared.types'

export type TSetSteps = (steps:TStepDefsList) => void


export type TExpPart = TPartsMatch & {
  // TODO: may need to validate value is always a string
  // In some cases it may be a number
  value?:string

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
  description?: string,
}