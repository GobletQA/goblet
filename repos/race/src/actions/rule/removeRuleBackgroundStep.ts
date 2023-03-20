import type { TRaceRule } from '@GBR/types'

import { findRule } from '@GBR/utils/find'
import { logNotFound } from '@GBR/utils/logging'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'

const prefix = `[Remove Rule#Scenario#Step]`

export const removeRuleBackgroundStep = async (
  stepId:string,
  ruleId?:string
) => {

  const { feature } = await getFeature()
  if(!feature) return
  if(!ruleId) return logNotFound(`rule Id`, prefix, feature, stepId, ruleId)

  const {
    rule,
    rules,
    ruleIdx,
  } = findRule(feature, ruleId)
  if(!rule) return

  if(!rule.background) return logNotFound(`background`, prefix, rule)

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