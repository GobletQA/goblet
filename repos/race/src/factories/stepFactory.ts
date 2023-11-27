import type { TRaceFeature, TRaceStep, TRaceStepParent } from '@GBR/types'

import { EStepType, EAstObject } from '@ltipton/parkin'
import { deepMerge, emptyArr } from '@keg-hub/jsutils'
import { ParkinWorker } from '@GBR/workers/parkin/parkinWorker'

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

export const stepFactory = async ({
  step,
  parent,
  feature,
  empty=false
}:TStepFactory) => {

  const index = await ParkinWorker.findIndex({ parent, feature, type:EAstObject.steps })
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

export const stepsFactory = async ({
  steps,
  parent,
  feature,
  empty=false
}:TStepsFactory) => {
  if(!steps?.length) return emptyArr as TRaceStep[]

  const built = await Promise.all(steps.map(async (step) => step && await stepFactory({ parent, step, empty, feature })))
  return built.filter(Boolean)
}