import { findScenario, findRule } from '@GBR/utils/find'
import { stepFactory } from '@GBR/factories/stepFactory'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'

export const addRuleScenarioStep = async (
  scenarioId:string,
  ruleId:string
) => {
  const feature = await getFeature()
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


  scenarios[scenarioIdx as number] = {
    ...scenario,
    steps: [
      ...scenario.steps,
      stepFactory({empty: true})
    ]
  }

  rules[ruleIdx as number] = {...rule, scenarios}

  updateFeature({...feature, rules})

}