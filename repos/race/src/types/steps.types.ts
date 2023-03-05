import type { TStepDefsList } from '@ltipton/parkin'
import type { TPartsMatch, EExpParmKind } from './shared.types'

export type TSetSteps = (steps:TStepDefsList) => void


export type TExpPart = TPartsMatch & {
  value?:unknown
  example?: string,
  kind?: EExpParmKind
  description?: string,
}