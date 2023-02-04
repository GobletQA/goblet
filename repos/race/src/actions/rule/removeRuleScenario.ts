import { findRule } from '@GBR/utils/find'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'

export const removeRuleScenario = async (
  scenarioId:string,
  parentId:string
) => {

  const feature = await getFeature()
  if(!feature) return

  const {
    rule,
    rules,
    ruleIdx,
  } = findRule(feature, parentId)
  if(!rule) return


  rules[ruleIdx as number] = {
    ...rule,
    scenarios: rule.scenarios.filter(scenario => scenario.uuid !== scenarioId)
  }

  updateFeature({...feature, rules})

}