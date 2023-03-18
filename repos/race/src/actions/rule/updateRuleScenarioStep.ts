
import type { TRaceStep } from '@GBR/types'

import { findStep, findScenario, findRule } from '@GBR/utils/find'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'

export const updateRuleScenarioStep = async (
  step:TRaceStep,
  scenarioId:string,
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

  const {
    scenario,
    scenarios,
    scenarioIdx
  } = findScenario(rule, scenarioId)
  if(!scenario) return

  const { step:found, stepIdx, steps } = findStep(scenario, step.uuid)
  if(!found) return

  steps[stepIdx] = step
  scenarios[scenarioIdx] = {...scenario, steps}
  rules[ruleIdx] = {...rule, scenarios}

  updateFeature({...feature, rules})

}