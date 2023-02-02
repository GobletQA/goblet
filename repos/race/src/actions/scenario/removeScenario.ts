import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'

export const removeScenario = async (scenarioId:string) => {
  const feature = await getFeature()
  if(!feature) console.warn(`Can not access feature context from 'addStory' action.`) 
  
  const scenarios = feature?.scenarios?.filter(scenario => scenario.uuid !== scenarioId)
  updateFeature({...feature, scenarios})

}