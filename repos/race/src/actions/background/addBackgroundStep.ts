import type { TRaceBackground, TRaceStep } from '@GBR/types'

import { emptyArr } from '@keg-hub/jsutils'
import { findBackground } from '@GBR/utils/find'
import { stepFactory } from '@GBR/factories/stepFactory'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'
import { logNotFound, factoryFailed, missingId } from '@GBR/utils/logging'

const prefix = `[Add Background#Step]`

export const addBackgroundStep = async (
  backgroundId:string,
  addStep?:TRaceStep,
  addIdx?:number
) => {
  if(!backgroundId) return missingId(`background`, prefix)

  const { feature } = await getFeature()
  if(!feature) return logNotFound(`feature`, prefix)

  const { background, rule, index } = findBackground(backgroundId, feature)
  if(!background) return logNotFound(`background`, prefix)

  let step = addStep
  if(step){
    background.steps = [...(background.steps || emptyArr)]
    background.steps.splice(addIdx || background.steps.length - 1, 0, step)
  }
  else {
    step = stepFactory({
      feature,
      parent: background
    })
    if(!step) return factoryFailed(`step`, prefix)

    background.steps = [...(background.steps || emptyArr), step]
  }

  if(!rule || !index)
    return updateFeature({...feature, background}, { expand: step.uuid })

  const rules = [...(feature?.rules || emptyArr)]
  rules[index] = {...rule, background}

  updateFeature({...feature, rules})

}