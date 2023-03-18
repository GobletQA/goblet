
import type { TRaceScenario } from '@GBR/types'

import { findRule, findScenario } from '@GBR/utils/find'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'

export const updateRuleScenario = async (
  scenarioId:string,
  updated:Partial<TRaceScenario>,
  ruleId:string
) => {
  const { feature } = await getFeature()
  if(!feature) return

  const {
    rule,
    rules,
    ruleIdx,
  } = findRule(feature, ruleId)
  if(!rule) return

  if(!rule?.scenarios?.length)
    return console.warn(`Change Rule#scenario - Rule does not contain any scenarios`, rule)

  const {
    scenario,
    scenarios,
    scenarioIdx
  } = findScenario(rule, scenarioId)
  if(!scenario) return console.warn(`Change Rule#scenario - Scenario could not be found`, rule)

  scenarios[scenarioIdx] = {...scenario, ...updated}
  rules[ruleIdx] = {...rule, scenarios}

  updateFeature({...feature, rules})

}