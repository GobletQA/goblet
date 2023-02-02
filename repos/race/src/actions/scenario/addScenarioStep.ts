import { findScenario } from '@GBR/utils/find'
import { stepFactory } from '@GBR/factories/stepFactory'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'

export const addScenarioStep = async (parentId:string) => {
  if(!parentId) return console.warn(`Can not update scenario step without scenario Id`)
  
  const feature = await getFeature()
  if(!feature) console.warn(`Can not access feature context from 'addStory' action.`) 

  const {
    scenario,
    scenarios,
    scenarioIdx
  } = findScenario(feature, parentId)
  if(!scenario) return

  scenarios[scenarioIdx] = {
    ...scenario,
    steps: [
      ...scenario.steps,
      stepFactory(undefined, true)
    ]
  }

  updateFeature({...feature, scenarios})
}