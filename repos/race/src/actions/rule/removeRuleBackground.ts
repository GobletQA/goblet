import { findRule } from '@GBR/utils/find'
import { logNotFound } from '@GBR/utils/logging'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'

const prefix = `[Remove Rule#Background]`

export const removeRuleBackground = async (
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

  const { background, ...updated } = rule
  rules[ruleIdx as number] = updated

  updateFeature({...feature, rules})

}