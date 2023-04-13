import type { TPartsMatch } from '@GBR/types'
import type { Parkin, TStepDef } from '@ltipton/parkin'


export const expressionParts = (parkin:Parkin, def:TStepDef) => {
  return def?.meta?.expressions?.length
    ? parkin.matcher.parts(def.match as string) as TPartsMatch[]
    : [] as TPartsMatch[]
}