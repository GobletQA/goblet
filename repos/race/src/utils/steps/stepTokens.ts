import type { TMatchTokens } from '@GBR/types'
import type{ Parkin, TStepDef } from '@ltipton/parkin'

import { emptyArr } from '@keg-hub/jsutils'
import { EPartMatchTypes } from '@ltipton/parkin'

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

  /**
   * If a definition exists,
   * Then parse out and expression parameter parse from it
   * Ignore all other types such as optional and alternate
   */
  return def
    ? parkin.matcher.stepTokens(step, def, { include: [EPartMatchTypes.parameter] })
    : emptyArr as TMatchTokens[]
}
