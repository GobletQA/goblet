import type{ Parkin, TStepDef } from '@ltipton/parkin'
import type { TMatchTokens } from '@GBR/types'

import { emptyArr } from '@keg-hub/jsutils'

export type TStepTokens = {
  step:string
  def:TStepDef
  parkin:Parkin
}

export const stepTokens = (props: TStepTokens) => {
  const {
    def,
    step,
    parkin,
  } = props
  
  return def
    ? parkin.matcher.stepTokens(step, def)
    : emptyArr as TMatchTokens[]
}
