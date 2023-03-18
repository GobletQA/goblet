import type { TRaceFeature, TRaceStep } from '@GBR/types'

import { EStepType } from '@ltipton/parkin'
import { deepMerge, emptyArr, emptyObj, uuid } from '@keg-hub/jsutils'

export type TStepsFactory = {
  empty?:boolean
  feature: TRaceFeature
  steps?:Partial<TRaceStep>[]
}

export type TStepFactory = {
  empty?:boolean
  feature: TRaceFeature
  step?:Partial<TRaceStep>
}

const emptyStep = ():Partial<TRaceStep> => ({
  step: `  `,
  uuid: uuid(),
  whitespace: `    `,
  type: EStepType.step,
})

export const stepFactory = ({
  step,
  feature,
  empty=false
}:TStepFactory) => {
  return empty || step
    ? deepMerge<TRaceStep>(emptyStep(), step)
    : emptyStep() as TRaceStep
}

export const stepsFactory = ({
  steps,
  feature,
  empty=false
}:TStepsFactory) => {
  return steps?.length
    ? steps.map(step => step && stepFactory({ step, empty, feature })).filter(Boolean)
    : emptyArr as TRaceStep[]
}