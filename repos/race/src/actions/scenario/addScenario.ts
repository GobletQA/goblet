import { ESectionType } from '@GBR/types'

import { scenarioFactory } from '@GBR/factories/scenarioFactory'
import { patchFeature } from '@GBR/actions/feature/patchFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'

export const addScenario = async () => {
  const { feature, indexes } = await getFeature()
  if(!feature) return

  const scenario = scenarioFactory({feature, empty: true})

  patchFeature({
    feature,
    indexes,
    child: scenario,
    childKey: ESectionType.scenarios
  })
}