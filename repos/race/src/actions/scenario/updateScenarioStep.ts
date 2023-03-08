import type { TStepAst } from '@ltipton/parkin'
import { findStep, findScenario } from '@GBR/utils/find'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'

export const updateScenarioStep = async (step:TStepAst, scenarioId:string) => {
  const feature = await getFeature()
  if(!feature) return

  const {
    scenario,
    scenarios,
    scenarioIdx
  } = findScenario(feature, scenarioId)
  if(!scenario) return
  
  const { step:found, stepIdx, steps } = findStep(scenario, step.uuid)
  if(!found) return
  
  steps[stepIdx] = step
  scenarios[scenarioIdx] = {...scenario, steps}

  updateFeature({...feature, scenarios})
}