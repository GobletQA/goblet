import { missing, logNotFound } from '@GBR/utils/logging'
import { findStep, findScenario } from '@GBR/utils/find'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'

const prefix = `[Update Scenario Step]`
export const updateScenarioStepPos = async (
  scenarioId:string,
  oldIdx:number,
  newIdx:number,
) => {
  const { feature } = await getFeature()
  if(!feature) return logNotFound(`feature`, prefix)

  const {
    item:scenario,
    group:scenarios,
    index:scenarioIdx,
  } = findScenario(feature, scenarioId)
  if(!scenario) return logNotFound(`scenario`, prefix)

  const moveStep = scenario.steps[oldIdx]
  if(!moveStep) return missing(`Step. Failed to update step position.`, prefix)

  const steps = [...scenario.steps]
  steps.splice(oldIdx, 1)
  steps.splice(newIdx, 0, moveStep)

  scenarios[scenarioIdx] = {...scenario, steps}

  updateFeature({...feature, scenarios})

}