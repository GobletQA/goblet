import type {
  TRaceFeature,
  TRaceScenario,
} from '@GBR/types'

import { EAstObject } from '@ltipton/parkin'
import { SimpleScenarioTag } from '@GBR/constants'
import { scenarioFactory } from '@GBR/factories/scenarioFactory'
import { findScenarioWithTag } from '@GBR/utils/find/findScenarioWithTag'

export const ensureScenario = (parent:TRaceFeature) => {
  if(parent?.scenarios?.length){
    const found = findScenarioWithTag(parent?.scenarios, SimpleScenarioTag)
    if(found) return found
  }

  return scenarioFactory({
    parent,
    empty: true,
    feature: parent,
    tags: [SimpleScenarioTag],
    scenario: {
      scenario: `Steps`,
      type: EAstObject.scenario,
    },
  }) as TRaceScenario
}