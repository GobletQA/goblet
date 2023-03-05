import type { TStepAst } from '@ltipton/parkin'

import { EStepKey } from '@ltipton/parkin'
import { deepMerge, emptyArr, emptyObj, uuid } from '@keg-hub/jsutils'

export type TStepsFactory = {
  steps?:Partial<TStepAst>[],
  empty?:boolean
}

export type TStepFactory = {
  step?:Partial<TStepAst>,
  empty?:boolean
}

const emptyStep = () => ({
  step: ``,
  index: 0,
  uuid: uuid(),
  type: EStepKey.given,
})

export const stepFactory = ({
  step,
  empty=false
}:TStepFactory) => {
  return empty || step
    ? deepMerge<TStepAst>(emptyStep(), step)
    : emptyObj as TStepAst
}

export const stepsFactory = ({
  steps,
  empty=false
}:TStepsFactory) => {
  return steps?.length
    ? steps.map(step => step && stepFactory({ step, empty })).filter(Boolean)
    : emptyArr as TStepAst[]
}