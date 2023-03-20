import type { TRaceRule } from '@GBR/types'

import { findRule } from '@GBR/utils/find'
import { deepMerge } from '@keg-hub/jsutils'
import { logNotFound, missingId } from '@GBR/utils/logging'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'

const prefix = `[Update Rule]`
export const updateRule = async (ruleId:string, update:Partial<TRaceRule>) => {
  if(!ruleId) return missingId(`rule`, prefix)
  
  const { feature } = await getFeature()
  if(!feature) return logNotFound(`feature`, prefix)

  const {
    rule,
    rules,
    ruleIdx
  } = findRule(feature, ruleId)
  if(!rule) return logNotFound(`rule`, prefix)

  rules[ruleIdx] = deepMerge(rule, update)

  updateFeature({...feature, rules})
}