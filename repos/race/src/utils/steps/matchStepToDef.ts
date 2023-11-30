import type { TRaceStep } from '@GBR/types'
import type { Parkin } from '@ltipton/parkin'


export type THMatchStepToDef = {
  step:TRaceStep
  parkin:Parkin
}

export const matchStepToDef = (props:THMatchStepToDef) => {
  const { step, parkin } = props

  if(!parkin)  return { step }

  const { definition } = parkin.matcher.search(step.step, {
    partial: true,
    worldReplace: false
  })

  return {
    definition,
    step: {
      ...step,
      definition: definition?.uuid || undefined
    },
  }
}