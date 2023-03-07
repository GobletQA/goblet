import { findRule } from '@GBR/utils/find'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'

export const removeRuleBackground = async (
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

  const { background, ...updated } = rule
  rules[ruleIdx as number] = updated

  updateFeature({...feature, rules})

}