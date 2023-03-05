import { ESectionType } from '@GBR/types'
import { findRule } from '@GBR/utils/find'
import { scenarioFactory } from '@GBR/factories/scenarioFactory'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'

export const addRuleScenario = async (ruleId:string) => {

  const feature = await getFeature()
  if(!feature) return

  const {
    rule,
    rules,
    ruleIdx,
  } = findRule(feature, ruleId)
  if(!rule) return


  rules[ruleIdx as number] = {
    ...rule,
    scenarios: [
      ...rule.scenarios,
      scenarioFactory({empty: true, parent: ESectionType.rule})
    ]
  }

  updateFeature({...feature, rules})

}