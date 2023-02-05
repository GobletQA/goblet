
import type {
  IParkin,
  TStepDef,
  TMatchTokens,
} from '@GBR/types'

import { emptyArr } from '@keg-hub/jsutils'

export const stepTokens = (parkin:IParkin, step:string, def:TStepDef) => {
  return def
    ? parkin.matcher.stepTokens(step, def)
    : emptyArr as TMatchTokens[]
}
