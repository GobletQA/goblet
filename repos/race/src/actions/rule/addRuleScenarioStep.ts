import { findScenario, findRule } from '@GBR/utils/find'
import { stepFactory } from '@GBR/factories/stepFactory'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'
import { logNotFound, factoryFailed } from '@GBR/utils/logging'

const prefix = `[Add Rule#Scenario#Step]`

export const addRuleScenarioStep = async (
  scenarioId:string,
  ruleId:string
) => {
  const { feature } = await getFeature()
  if(!feature) return logNotFound(`feature`, prefix)

  const {
    rule,
    rules,
    ruleIdx,
  } = findRule(feature, ruleId)
  if(!rule) return logNotFound(`rule`, prefix)

  const {
    item:scenario,
    group:scenarios,
    index:scenarioIdx
  } = findScenario(feature, scenarioId, rule)
  if(!scenario) return logNotFound(`scenario`, prefix)

  const step = stepFactory({
    feature,
    parent: scenario,
  })

  if(!step) return factoryFailed(`step`, prefix)

  scenarios[scenarioIdx as number] = {
    ...scenario,
    steps: [...scenario.steps, step]
  }

  rules[ruleIdx as number] = {...rule, scenarios}

  updateFeature({...feature, rules}, { expand: step.uuid })

}