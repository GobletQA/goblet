import type { TStepAst } from '@GBR/types'

import { EStepKey } from '@GBR/types'
import { deepMerge, emptyArr, emptyObj, uuid } from '@keg-hub/jsutils'

const emptyStep = () => ({
  step: ``,
  index: 0,
  uuid: uuid(),
  type: EStepKey.given,
})

export const stepFactory = (
  step?:Partial<TStepAst>,
  empty:boolean=false
) => {
  return empty || step
    ? deepMerge<TStepAst>(emptyStep(), step)
    : emptyObj as TStepAst
}

export const stepsFactory = (
  steps?:Partial<TStepAst>[],
  empty:boolean=false
) => {
  return steps?.length
    ? steps.map(step => step && stepFactory(step, empty)).filter(Boolean)
    : emptyArr as TStepAst[]
}