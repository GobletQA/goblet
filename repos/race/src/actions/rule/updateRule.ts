import type { TRaceFeature, TRaceRule } from '@GBR/types'

import { findRule } from '@GBR/utils/find'
import { omitKeys } from '@keg-hub/jsutils'
import { logNotFound, missingId } from '@GBR/utils/logging'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'

const prefix = `[Update Rule]`

export type TUpdateRule = {
  ruleId:string
  persist?:Boolean
  feature?:TRaceFeature
  update:Partial<TRaceRule>
}

export const updateRule = async (props:TUpdateRule) => {
  const {
    ruleId,
    update,
    persist
  } = props
  
  if(!ruleId) return missingId(`rule`, prefix)
  
  const { feature } = await getFeature(props.feature)
  if(!feature) return logNotFound(`feature`, prefix)

  const {
    rule,
    rules,
    ruleIdx
  } = findRule(feature, ruleId)
  if(!rule) return logNotFound(`rule`, prefix)

  // Scenarios and background are updated through other actions
  rules[ruleIdx] = {...rule,...omitKeys(update, [`scenarios`, `background`])}

  const updated = {...feature, rules}
  persist !== false && updateFeature(updated, { skipAudit: true })

  return updated
}