import type {
  TRaceFeature,
  TRaceScenario,
} from '@GBR/types'

import { EAstObject } from '@ltipton/parkin'
import { SimpleScenarioTag } from '@GBR/constants'
import { simpleScenario } from '@GBR/factories/scenarioFactory'
import { findScenarioWithTag } from '@GBR/utils/find/findScenarioWithTag'

const findSimpleIdx = (parent:TRaceFeature) => {
  if(!parent) return 3

  const { scenarios, content } = parent

  // If no content in the feature yet
  // Then return 3, i.e. 
  // Feature: <name>
  //
  //  Scenario: <simple-scenario>
  if(!content) return 3
  
  // If no scenarios, then just add to the end of the file
  if(!scenarios.length) return content.split(`\n`).length - 1

  // If scenarios exist, then add the tag to the first scenario
  const first = scenarios[0]
  return first.tags ? first.tags.index : first.index - 1

}

export const ensureScenario = (parent:TRaceFeature) => {
  if(!parent) return undefined
  
  if(parent?.scenarios?.length){
    const found = findScenarioWithTag(parent?.scenarios, SimpleScenarioTag)
    if(found) return found
  }

  return simpleScenario({
    parent,
    empty: true,
    feature: parent,
    tags: [SimpleScenarioTag],
    index: parent?.scenarios?.length || 0,
    scenario: {
      scenario: `Steps`,
      type: EAstObject.scenario,
    },
  }) as TRaceScenario
}