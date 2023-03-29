import type { TRaceFeature } from '@GBR/types'

import { ruleFactory } from '@GBR/factories/ruleFactory'
import { logNotFound, factoryFailed } from '@GBR/utils/logging'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'

const prefix = `[Add Rule]`

export type TAddRule = {
  feature?:TRaceFeature
}

export const addRule = async (props?:TAddRule) => {
  const { feature } = await getFeature(props?.feature)
  if(!feature) return logNotFound(`feature`, prefix)

  const rule = ruleFactory({feature, empty: true})
  if(!rule) return factoryFailed(`rule`, prefix)
  
  const rules = [...(feature.rules || [])]
  rules.push(rule)

  const updated = {...feature, rules}
  !props?.feature && updateFeature(updated, { expand: rule.uuid })

  return updated
}