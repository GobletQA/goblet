import type { TRaceStep } from '@GBR/types'

import { EStepType } from '@ltipton/parkin'
import { deepMerge, emptyArr, emptyObj, uuid } from '@keg-hub/jsutils'

export type TStepsFactory = {
  steps?:Partial<TRaceStep>[],
  empty?:boolean
}

export type TStepFactory = {
  step?:Partial<TRaceStep>,
  empty?:boolean
}

const emptyStep = ():TRaceStep => ({
  step: `  `,
  uuid: uuid(),
  type: EStepType.given,
  whitespace: `    `,
})

export const stepFactory = ({
  step,
  empty=false
}:TStepFactory) => {
  return empty || step
    ? deepMerge<TRaceStep>(emptyStep(), step)
    : emptyStep() as TRaceStep
}

export const stepsFactory = ({
  steps,
  empty=false
}:TStepsFactory) => {
  return steps?.length
    ? steps.map(step => step && stepFactory({ step, empty })).filter(Boolean)
    : emptyArr as TRaceStep[]
}