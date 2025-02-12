import type {
  TRaceStep,
  TRaceFeature,
  TRaceStepParent,
} from '@GBR/types'


import { emptyArr, exists } from '@keg-hub/jsutils'
import { factoryFailed } from '@GBR/utils/logging'
import { stepFactory } from '@GBR/factories/stepFactory'
import {EAstObject} from '@ltipton/parkin'

const prefix = `[Add Step]`


export const buildStep = async <T extends TRaceStepParent>(
  feature:TRaceFeature,
  parent:T,
  step?:TRaceStep,
  index?:number,
) => {
  const steps = [...(parent.steps || emptyArr)]

  if(step){
    const idx = exists<number>(index) ? index : steps.length
    steps.splice(idx, 0, step)
  }
  else {
    step = await stepFactory({ feature, parent })
    if(!step) return factoryFailed(`step`, prefix)

    step.uuid = `${parent.uuid}.${step?.type || EAstObject.step}.${steps.length}`
    steps.push(step)
  }

  return {
    step,
    steps,
  }
}
