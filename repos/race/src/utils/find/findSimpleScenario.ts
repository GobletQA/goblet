import type {
  TRaceStep,
  TRaceFeature,
  TRaceScenario,
} from '@GBR/types'

import { SimpleScenarioTag } from '@GBR/constants'
import { findScenarioWithTag } from '@GBR/utils/find/findScenarioWithTag'


export type TGetSimpleScenario = {
  step?:TRaceStep
  persist?:boolean
  feature: TRaceFeature
  scenario: TRaceScenario
}

export const findSimpleScenario = ({ feature, scenario }:TGetSimpleScenario) => {
  
  if(!feature.scenarios.length)
    return {scenario, index: 0}

  const found = findScenarioWithTag(feature.scenarios, SimpleScenarioTag)

  return !found
    ? {scenario, index: 0}
    : {scenario: {...found}, index: feature.scenarios.indexOf(found)}
}
