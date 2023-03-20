import { findRule } from '@GBR/utils/find'
import { stepFactory } from '@GBR/factories/stepFactory'
import { logNotFound, factoryFailed } from '@GBR/utils/logging'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'

const prefix = `[Add Rule#Background#Step]`

export const addRuleBackgroundStep = async (
  ruleId:string
) => {
  const { feature } = await getFeature()
  if(!feature) return logNotFound(`feature`, prefix)

  const {
    rule,
    rules,
    ruleIdx,
  } = findRule(feature, ruleId)
  if(!rule) return logNotFound(`rule`, prefix, ruleId)

  if(!rule.background) return logNotFound(`background`, prefix, rule)

  const step = stepFactory({
    feature,
    parent: rule.background,
  })

  if(!step) return factoryFailed(`step`, prefix)

  const background = {
    ...rule.background,
    steps: [...rule.background.steps, step]
  }

  rules[ruleIdx as number] = {...rule, background}

  updateFeature({...feature, rules})

}