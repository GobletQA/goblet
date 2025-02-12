import type { TRaceFeature } from '@GBR/types'

import { emptyArr } from '@keg-hub/jsutils'
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

  const rule = await ruleFactory({feature, empty: true})
  if(!rule) return factoryFailed(`rule`, prefix)
  
  const rules = [...(feature.rules || emptyArr)]
  rules.push(rule)

  const updated = {...feature, rules}
  !props?.feature && updateFeature(updated, { expand: rule.uuid, skipAudit: false })

  return updated
}