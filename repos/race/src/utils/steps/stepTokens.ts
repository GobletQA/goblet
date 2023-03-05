import type{ Parkin, TStepDef } from '@ltipton/parkin'
import type { TMatchTokens } from '@GBR/types'

import { emptyArr } from '@keg-hub/jsutils'

export const stepTokens = (parkin:Parkin, step:string, def:TStepDef) => {
  return def
    ? parkin.matcher.stepTokens(step, def)
    : emptyArr as TMatchTokens[]
}
