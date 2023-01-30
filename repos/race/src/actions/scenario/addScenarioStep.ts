import type { TRaceFeature } from '@GBR/types'

import { deepMerge } from '@keg-hub/jsutils'
import { stepFactory } from '@GBR/factories/stepFactory'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'

export const addScenarioStep = async (parentId:string) => {
  if(!parentId) return console.warn(`Can not update scenario step without scenario Id`)
  
  const { feature } = await getFeature()
  if(!feature) console.warn(`Can not access feature context from 'addStory' action.`) 

  const scenario = feature.scenarios.find(scenario => scenario.uuid === parentId)
  if(!scenario) return console.warn(`Scenario with id ${parentId} could not be found`)
  
  const scenarioIdx = feature.scenarios.indexOf(scenario)
  
  const scenarios = [...feature.scenarios]
  scenarios[scenarioIdx] = {
    ...scenario,
    steps: [
      ...scenario.steps,
      stepFactory(undefined, true)
    ]
  }

  updateFeature({...feature, scenarios})
}