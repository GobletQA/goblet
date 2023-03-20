import { ruleFactory } from '@GBR/factories/ruleFactory'
import { logNotFound, factoryFailed } from '@GBR/utils/logging'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'

const prefix = `[Add Rule]`

export const addRule = async () => {
  const { feature } = await getFeature()
  if(!feature) return logNotFound(`feature`, prefix)

  const rule = ruleFactory({feature, empty: true})
  if(!rule) return factoryFailed(`rule`, prefix)
  
  const rules = [...(feature.rules || [])]
  rules.push(rule)

  // TODO: rule not being saved ???
  updateFeature({...feature, rules}, { expand: rule.uuid })
}