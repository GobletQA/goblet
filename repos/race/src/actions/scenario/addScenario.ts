import { logNotFound, factoryFailed } from '@GBR/utils/logging'
import { scenarioFactory } from '@GBR/factories/scenarioFactory'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'

const prefix = `[Add Scenario]`
export const addScenario = async () => {
  const { feature } = await getFeature()
  if(!feature) return logNotFound(`feature`, prefix)

  const scenario = scenarioFactory({ feature, empty: true})
  const scenarios = [...(feature.scenarios || [])]

  if(!scenario) return factoryFailed(`scenario`, prefix)

  scenario && scenarios.push(scenario)

  updateFeature({...feature, scenarios}, { expand: scenario.uuid })
}