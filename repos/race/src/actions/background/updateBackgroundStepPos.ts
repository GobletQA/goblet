import type { TRaceFeature, TRaceStep, TRaceBackground } from '@GBR/types'

import { findRule } from '@GBR/utils/find'
import { EDndPos } from '@gobletqa/components'
import { moveStep } from '@GBR/utils/actions/moveStep'
import { missing, logNotFound } from '@GBR/utils/logging'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'

const prefix = `[Update Background Step]`

export type TUpdateBackgroundStepPos = {
  pos:EDndPos
  oldIdx:number
  newIdx:number
  persist?:Boolean
  feature?:TRaceFeature
  backgroundParentId:string
}


const fromRule = (props:TUpdateBackgroundStepPos, feature:TRaceFeature) => {
  const {
    pos,
    oldIdx,
    newIdx,
    persist,
    backgroundParentId
  } = props

  const {
    rule,
    rules,
    ruleIdx,
  } = findRule(feature, backgroundParentId)
  if(!rule) return logNotFound(`rule`, prefix)
  if(!rule.background) return missing(`Background on rule. Can not update step`, prefix, rule)

  rules[ruleIdx as number] = {
    ...rule,
    background: moveStep<TRaceBackground>(rule.background, oldIdx, newIdx, pos)
  }

  const updated = {...feature, rules}
  !persist !== false && updateFeature({...feature, rules})
  
  return updated
}

const fromFeature = (props:TUpdateBackgroundStepPos, feature:TRaceFeature) => {
  const {
    pos,
    oldIdx,
    newIdx,
    persist,
  } = props

  if(!feature.background) return logNotFound(`background`, prefix)

  const step = feature.background.steps[oldIdx]
  if(!step) return missing(`Step. Failed to update step position.`, prefix)

  const updated = {
    ...feature,
    background: moveStep<TRaceBackground>(feature.background, oldIdx, newIdx, pos)
  } as TRaceFeature

  !persist !== false && updateFeature(updated)

  return updated
}

export const updateBackgroundStepPos = async (props:TUpdateBackgroundStepPos) => {
  const { feature } = await getFeature(props.feature)
  if(!feature) return logNotFound(`feature`, prefix)

  return !props.backgroundParentId || props.backgroundParentId === feature.uuid
    ? fromFeature(props, feature)
    : fromRule(props, feature)
}