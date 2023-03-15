import type { TRaceBackground } from '@GBR/types'

import { findRule } from '@GBR/utils/find'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'

export const updateRuleBackground = async (
  background:TRaceBackground,
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

  if(!rule.background)
    return console.warn(`Remove Rule#background#step - Rule does not contain a background`, rule)

  rules[ruleIdx] = {
    ...rule,
    background: {
      ...rule.background,
      ...background
    }
  }

  updateFeature({...feature, rules})

}