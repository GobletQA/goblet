import type { TRaceStep, TRaceStepParent } from '@GBR/types'

import { emptyObj } from '@keg-hub/jsutils'

export type TFoundStep = {
  step?:TRaceStep
  stepIdx:number
  steps:TRaceStep[]
}

export const findStep = (
  parent:TRaceStepParent,
  stepId:string
) => {

  const step = parent?.steps?.find(step => step.uuid === stepId)
  if(!step){
    console.warn(`Step Id ${stepId} could not be found in parent`, parent, parent?.steps)
    return emptyObj as TFoundStep
  }

  const steps = [...(parent.steps || []) ]
  const stepIdx = steps.indexOf(step)

  return {
    step,
    steps,
    stepIdx
  } as TFoundStep

}