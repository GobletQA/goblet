import { findScenario } from '@GBR/utils/find'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'

export const removeScenarioStep = async (
  stepId:string,
  scenarioId?:string,
) => {

  const feature = await getFeature()
  if(!feature) return
  if(!scenarioId)
    return console.warn(`Remove Scenario#step - Scenario Id is required`,feature,stepId,scenarioId)
  if(!stepId)
    return console.warn(`Remove Scenario#step - Step Id is required`,feature,stepId,scenarioId)

  const {
    scenario,
    scenarios,
    scenarioIdx
  } = findScenario(feature, scenarioId)
  if(!scenario) return

  scenarios[scenarioIdx as number] = {
    ...scenario,
    steps: scenario.steps.filter(step => step.uuid !== stepId)
  }

  updateFeature({...feature, scenarios})

}