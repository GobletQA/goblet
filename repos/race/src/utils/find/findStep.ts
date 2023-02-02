import type { TStepAst, TStepParentAst } from '@GBR/types'
import { emptyObj } from '@keg-hub/jsutils'

export type TFoundStep = {
  step?:TStepAst
  stepIdx:number
  steps:TStepAst[]
}

export const findStep = (
  parent:TStepParentAst,
  stepId:string
) => {

  const step = parent?.steps?.find(step => step.uuid === stepId)
  if(!step){
    console.warn(`Step Id ${parent} could not be found`, parent, parent?.steps)
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