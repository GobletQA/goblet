import type { TExpPart } from '@GBR/types'
import { Parkin, TStepDef } from '@ltipton/parkin'

import { emptyArr } from '@keg-hub/jsutils'
import { expressionParts } from '@GBR/utils/steps/expressionParts'
import { matchExpressions } from '@GBR/utils/steps/matchExpressions'

export type TGetMatchExpressions = {
  def:TStepDef
  parkin:Parkin
}

export const getMatchExpressions = (props:TGetMatchExpressions) => {
  const {
    def,
    parkin,
  } = props
 
  const parts = def && expressionParts(parkin, def)
  const filtered = parts && parts.filter((part) => part && part.type !== `optional`)

  return def && filtered
    ? matchExpressions(def, filtered)
    : emptyArr as TExpPart[]

}