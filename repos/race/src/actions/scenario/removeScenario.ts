import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'

export const removeScenario = async (scenarioId:string) => {
  const { feature } = await getFeature()
  if(!feature) return
  
  const scenarios = feature?.scenarios?.filter(scenario => scenario.uuid !== scenarioId)
  updateFeature({...feature, scenarios})

}