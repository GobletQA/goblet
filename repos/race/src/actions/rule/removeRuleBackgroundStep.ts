import type { TRaceRule } from '@GBR/types'

import { findRule } from '@GBR/utils/find'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'

export const removeRuleBackgroundStep = async (
  stepId:string,
  ruleId?:string
) => {

  const feature = await getFeature()
  if(!feature) return
  if(!ruleId)
    return console.warn(`Remove Rule#scenario#step - Rule Id is required`,feature,stepId,ruleId)

  const {
    rule,
    rules,
    ruleIdx,
  } = findRule(feature, ruleId)
  if(!rule) return

  if(!rule.background)
    return console.warn(`Remove Rule#background#step - Rule does not contain a background`, rule)

  const updated:TRaceRule = {
    ...rule,
    background: {
      ...rule?.background,
      steps: rule?.background?.steps.filter(step => step.uuid !== stepId) || []
    }
  }

  rules[ruleIdx as number] = updated

  updateFeature({...feature, rules})

}