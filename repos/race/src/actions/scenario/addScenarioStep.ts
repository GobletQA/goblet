
import { findScenario } from '@GBR/utils/find'
import { stepFactory } from '@GBR/factories/stepFactory'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'
import { logNotFound, factoryFailed, missingId } from '@GBR/utils/logging'

const prefix = `[Add Scenario#Step]`

export const addScenarioStep = async (parentId:string) => {
  if(!parentId) return missingId(`scenario`, prefix)
  
  const { feature } = await getFeature()
  if(!feature) return

  const {
    scenario,
    scenarios,
    scenarioIdx
  } = findScenario(feature, parentId)
  if(!scenario) return logNotFound(`scenario`, prefix, parentId)

  const step = stepFactory({
    feature,
    parent: scenario,
  })
 
   if(!step) return factoryFailed(`step`, prefix)
 
  scenarios[scenarioIdx] = {
    ...scenario,
    steps: [...scenario.steps, step]
  }

  // TODO: NOT Auto-Expanding when added to the feature
  updateFeature({...feature, scenarios}, { expand: step.uuid })
}