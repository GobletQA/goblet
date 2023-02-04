import type { TPartsMatch, EExpParmKind, TStepDefs } from './shared.types'


export type TRaceStepDefs = TStepDefs
export type TSetSteps = (steps:TRaceStepDefs) => void


export type TExpPart = TPartsMatch & {
  value?:unknown
  example?: string,
  kind?: EExpParmKind
  description?: string,
}