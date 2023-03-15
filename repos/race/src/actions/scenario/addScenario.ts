import { ESectionType, EUpdateType } from '@GBR/types'
import { scenarioFactory } from '@GBR/factories/scenarioFactory'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'

export const addScenario = async () => {
  const feature = await getFeature()
  if(!feature) return

  const scenario = scenarioFactory({empty: true})
  const scenarios = [...(feature.scenarios || [])]
  scenario && scenarios.push(scenario)
  
  const index = scenarios.indexOf(scenario)

  updateFeature(
    {...feature, scenarios},
    {
      index,
      op: EUpdateType.ADD,
      type: ESectionType.scenario,
      path: `${ESectionType.scenarios}.${index}`,
    }
  )
}