import type { TRaceFeature } from '@GBR/types'

import { logNotFound } from '@GBR/utils/logging'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'

export type TRemoveRule = {
  ruleId:string
  persist?:Boolean
  feature?:TRaceFeature
}

export const removeRule = async (props:TRemoveRule) => {
  const {
    ruleId,
    persist,
  } = props
  
  const { feature } = await getFeature(props.feature)
  if(!feature) return logNotFound(`feature`, `[Remove Rule]`)

  const rules = feature?.rules?.filter(rule => rule.uuid !== ruleId)
  const update = {...feature, rules}
  persist !== false && updateFeature(update, { removeAuditSteps: true })

  return update
}