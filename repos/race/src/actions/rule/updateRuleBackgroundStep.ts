import type { TRaceStep } from '@GBR/types'

import { findStep, findRule } from '@GBR/utils/find'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'

export const updateRuleBackgroundStep = async (
  step:TRaceStep,
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

  const { step:found, stepIdx, steps } = findStep(rule.background, step.uuid)
  if(!found) return

  steps[stepIdx] = step

  rules[ruleIdx] = {
    ...rule,
    background: {
      ...rule.background,
      steps
    }
  }

  updateFeature({...feature, rules})

}