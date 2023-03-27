
import { findRule } from '@GBR/utils/find'
import { logNotFound, factoryFailed } from '@GBR/utils/logging'
import { backgroundFactory } from '@GBR/factories/backgroundFactory'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'

const prefix = `[Add Rule#background]`

export const addRuleBackground = async (ruleId:string) => {

  const { feature } = await getFeature()
  if(!feature) return

  const {
    rule,
    rules,
    ruleIdx,
  } = findRule(feature, ruleId)
  if(!rule) return logNotFound(`Rule ${ruleId}`, prefix)

  const background = backgroundFactory({
    feature,
    empty: true,
    parent: rule,
    background: rule?.background
  })

  if(!background) return factoryFailed(`background`, prefix)

  rules[ruleIdx as number] = {
    ...rule,
    background: background
  }

  // TODO: scenarios and backgrounds not being saved ???
  updateFeature({...feature, rules}, { expand: background.uuid })

}