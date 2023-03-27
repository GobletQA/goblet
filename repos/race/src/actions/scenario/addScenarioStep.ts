import type { TRaceStep } from '@GBR/types'

import { emptyArr } from '@keg-hub/jsutils'
import { findScenario } from '@GBR/utils/find'
import { stepFactory } from '@GBR/factories/stepFactory'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'
import { logNotFound, factoryFailed, missingId } from '@GBR/utils/logging'

const prefix = `[Add Scenario#Step]`

export const addScenarioStep = async (
  scenarioId:string,
  addStep?:TRaceStep,
  addIdx?:number
) => {
  if(!scenarioId) return missingId(`scenario`, prefix)
  
  const { feature } = await getFeature()
  if(!feature) return

  const {
    scenario,
    scenarios,
    scenarioIdx
  } = findScenario(feature, scenarioId)
  if(!scenario) return logNotFound(`scenario`, prefix, scenarioId)


  const steps = [...(scenario?.steps || emptyArr)]
  let step = addStep

  if(step) steps.splice(addIdx || scenario.steps.length - 1, 0, step)
  else {
    step = stepFactory({
      feature,
      parent: scenario
    })
    if(!step) return factoryFailed(`step`, prefix)

    steps.push(step)
  }

  scenarios[scenarioIdx] = {...scenario, steps}

  updateFeature({...feature, scenarios}, { expand: step.uuid })
}