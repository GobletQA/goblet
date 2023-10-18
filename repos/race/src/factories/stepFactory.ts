import type { TRaceFeature, TRaceStep, TRaceStepParent } from '@GBR/types'

import { findIndex } from '@GBR/utils/find/findIndex'
import { EStepType, EAstObject } from '@ltipton/parkin'
import { deepMerge, emptyArr } from '@keg-hub/jsutils'

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
  // TODO: update this to dynamically figure out the whitespace based on the number of parents
  // I.E. (feature - scenario - step === 4 spaces)
  // I.E. (feature - rule - scenario - step === 6 spaces)
  // Can use the uuid to figure out where in the chain it is and add 2 spaces per parent
  const whitespace = parent?.whitespace?.length ? `${parent.whitespace}  ` : `    `
  const uuid = `${parent.uuid}.${step?.type || EAstObject.step}.${parent?.steps?.length || 0}`

  return empty || step
    ? deepMerge<TRaceStep>(emptyStep({
        uuid,
        index,
        whitespace,
      }), step)
    : emptyStep({
        uuid,
        index,
        whitespace,
      }) as TRaceStep
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