import { findRule } from '@GBR/utils/find'
import { stepFactory } from '@GBR/factories/stepFactory'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'

export const addRuleBackgroundStep = async (
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

  const background = {
    ...rule.background,
    steps: [
      ...rule.background.steps,
      stepFactory({
        step: {
          whitespace: `${rule.whitespace}${rule.background.whitespace}`
        } 
      })
    ]
  }

  rules[ruleIdx as number] = {...rule, background}

  updateFeature({...feature, rules})

}