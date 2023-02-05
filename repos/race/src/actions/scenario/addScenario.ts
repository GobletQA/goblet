import { scenarioFactory } from '@GBR/factories/scenarioFactory'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'

export const addScenario = async () => {
  const feature = await getFeature()
  if(!feature) return

  const scenario = scenarioFactory(undefined, true)
  const scenarios = [...(feature.scenarios || [])]
  scenario && scenarios.push(scenario)

  updateFeature({...feature, scenarios})
}