import type { TRaceStep } from '@GBR/types'
import { findStep, findScenario } from '@GBR/utils/find'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'


export const updateScenarioStepPos = async (
  scenarioId:string,
  oldIdx:number,
  newIdx:number,
) => {
  const feature = await getFeature()
  if(!feature) return

  const {
    scenario,
    scenarios,
    scenarioIdx
  } = findScenario(feature, scenarioId)
  if(!scenario) return

  const moveStep = scenario.steps[oldIdx]
  if(!moveStep)
    return console.warn(`Failed to update step position. Step could not be located`)

  const steps = [...scenario.steps]
  steps.splice(oldIdx, 1)
  steps.splice(newIdx, 0, moveStep)

  scenarios[scenarioIdx] = {...scenario, steps}

  updateFeature({...feature, scenarios})

}