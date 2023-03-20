import { findRule } from '@GBR/utils/find'
import { logNotFound, factoryFailed } from '@GBR/utils/logging'
import { scenarioFactory } from '@GBR/factories/scenarioFactory'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'

const prefix = `[Add Rule#Scenario]`

export const addRuleScenario = async (ruleId:string) => {

  const { feature } = await getFeature()
  if(!feature) return

  const {
    rule,
    rules,
    ruleIdx,
  } = findRule(feature, ruleId)
  if(!rule) return logNotFound(`rule`, prefix, ruleId)

  const scenario = scenarioFactory({
    feature,
    parent:rule,
  })

  if(!scenario) return factoryFailed(`scenario`, prefix)

  rules[ruleIdx as number] = {
    ...rule,
    scenarios: [...rule.scenarios, scenario]
  }

  // TODO: scenarios and backgrounds not being saved ???
  updateFeature({...feature, rules}, { expand: scenario.uuid })

}