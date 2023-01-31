import type { TScenarioParentAst } from '@GBR/types'

import { scenarioFactory } from '@GBR/factories/scenarioFactory'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'

export const addScenario = async () => {
  const feature = await getFeature()
  if(!feature) console.warn(`Can not access feature context from 'addStory' action.`) 

  const scenario = scenarioFactory(undefined, true)
  const scenarios = [...(feature.scenarios || [])]
  scenario && scenarios.push(scenario)

  updateFeature({...feature, scenarios})
}