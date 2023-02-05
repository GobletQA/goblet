
import type {
  IParkin,
  TStepDef,
  TPartsMatch,
} from '@GBR/types'

export const expressionParts = (parkin:IParkin, def:TStepDef) => {
  return def?.meta?.expressions?.length
    ? parkin.matcher.parts(def.match as string)
    : [] as TPartsMatch[]
}