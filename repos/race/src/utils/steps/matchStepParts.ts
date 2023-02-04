import type {
  IParkin,
  TStepDef,
} from '@GBR/types'

import { emptyArr } from '@keg-hub/jsutils'

export const matchStepParts = (parkin:IParkin, step:string, def:TStepDef) => {
  const parts = parkin.matcher.parts(step)
  const { found, expressions } = parkin.matcher.expressionFind(def, step)

  return {
    parts,
    expressions,
    values: found?.match || emptyArr,
  }
}
