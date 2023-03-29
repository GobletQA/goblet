import type { TRaceFeature, TRaceBackground } from '@GBR/types'

import { findRule } from '@GBR/utils/find'
import { logNotFound } from '@GBR/utils/logging'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'

const prefix = `[Update Background]`

export type TUpdateBackground = {
  parentId:string
  feature?:TRaceFeature
  background:TRaceBackground
}


const toRule = (props:TUpdateBackground, feature:TRaceFeature) => {
  const {
    parentId,
    background
  } = props

  const {
    rule,
    rules,
    ruleIdx,
  } = findRule(feature, parentId)
  if(!rule) return logNotFound(`rule`, prefix)

  rule.background = {...rule.background, ...background}
  rules[ruleIdx as number] = rule

  const updated = {...feature, rules}
  !props.feature && updateFeature(updated)
  
  return updated
}

const toFeature = (props:TUpdateBackground, feature:TRaceFeature) => {
  const { background } = props
  
  const updated = {...feature, background: {...feature?.background, ...background}}
  !props.feature && updateFeature(updated)

  return updated
}

export const updateBackground = async (props:TUpdateBackground) => {
  const { parentId } = props

  const { feature } = await getFeature(props.feature)
  if(!feature) return logNotFound(`feature`, prefix)

  return feature.uuid === parentId
    ? toFeature(props, feature)
    : toRule(props, feature)
}