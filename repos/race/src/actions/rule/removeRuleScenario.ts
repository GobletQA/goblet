import { findRule } from '@GBR/utils/find'
import { logNotFound } from '@GBR/utils/logging'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'

const prefix = `[Remove Rule#Scenario]`
export const removeRuleScenario = async (
  scenarioId:string,
  parentId:string
) => {

  const { feature } = await getFeature()
  if(!feature) return logNotFound(`feature`, prefix)

  const {
    rule,
    rules,
    ruleIdx,
  } = findRule(feature, parentId)
  if(!rule) return logNotFound(`rule`, prefix)


  rules[ruleIdx as number] = {
    ...rule,
    scenarios: rule.scenarios.filter(scenario => scenario.uuid !== scenarioId)
  }

  updateFeature({...feature, rules})

}