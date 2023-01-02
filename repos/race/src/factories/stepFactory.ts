import type { TStepAst } from '@GBR/types'

import { EStepKey } from '@GBR/types'
import { deepMerge, emptyArr, emptyObj, uuid } from '@keg-hub/jsutils'

export const stepFactory = (step?:Partial<TStepAst>) => {
  return  step
    ? deepMerge<TStepAst>({
        step: ``,
        index: 0,
        uuid: uuid(),
        type: EStepKey.given,
      }, step)
    : emptyObj as TStepAst
}

export const stepsFactory = (steps?:Partial<TStepAst>[]) => {
  return steps?.length
    ? steps.map(step => step && stepFactory(step)).filter(Boolean)
    : emptyArr as TStepAst[]
}