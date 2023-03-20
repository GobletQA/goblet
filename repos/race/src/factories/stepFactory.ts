import type { TRaceFeature, TRaceStep, TRaceStepParent } from '@GBR/types'

import { findIndex } from '@GBR/utils/find/findIndex'
import { EStepType, EAstObject } from '@ltipton/parkin'
import { deepMerge, emptyArr, uuid } from '@keg-hub/jsutils'

export type TStepsFactory = {
  empty?:boolean
  feature: TRaceFeature
  parent:TRaceStepParent
  steps?:Partial<TRaceStep>[]
}

export type TStepFactory = {
  empty?:boolean
  feature: TRaceFeature
  parent:TRaceStepParent
  step?:Partial<TRaceStep>
}

const emptyStep = (step:Partial<TRaceStep>):Partial<TRaceStep> => ({
  step: `  `,
  uuid: uuid(),
  type: EStepType.step,
  ...step
})

export const stepFactory = ({
  step,
  parent,
  feature,
  empty=false
}:TStepFactory) => {

  const index = findIndex({ parent, feature, type:EAstObject.steps })
  const whitespace = parent?.whitespace?.length ? `${parent.whitespace}  ` : `    `

  return empty || step
    ? deepMerge<TRaceStep>(emptyStep({ index, whitespace }), step)
    : emptyStep({ index }) as TRaceStep
}

export const stepsFactory = ({
  steps,
  parent,
  feature,
  empty=false
}:TStepsFactory) => {
  return steps?.length
    ? steps.map(step => step && stepFactory({ parent, step, empty, feature })).filter(Boolean)
    : emptyArr as TRaceStep[]
}