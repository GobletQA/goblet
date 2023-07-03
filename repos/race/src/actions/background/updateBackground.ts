import type { TRaceFeature, TRaceBackground, TUpdateFeatureOpts } from '@GBR/types'

import { findRule } from '@GBR/utils/find'
import { logNotFound } from '@GBR/utils/logging'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'

const prefix = `[Update Background]`

export type TUpdateBackground = {
  parentId:string
  persist?:Boolean
  feature?:TRaceFeature
  background:TRaceBackground
  featureOpts?:TUpdateFeatureOpts
}


const toRule = (props:TUpdateBackground, feature:TRaceFeature) => {
  const {
    persist,
    parentId,
    background,
    featureOpts
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
  persist !== false && updateFeature(updated, { skipAudit: true, ...featureOpts })

  return updated as TRaceFeature
}

const toFeature = (props:TUpdateBackground, feature:TRaceFeature) => {
  const { persist, background, featureOpts } = props
  
  const updated = {...feature, background: {...feature?.background, ...background}}
  persist !== false && updateFeature(updated, { skipAudit: true, ...featureOpts })

  return updated as TRaceFeature
}

export const updateBackground = async (props:TUpdateBackground) => {
  const { parentId } = props

  const { feature } = await getFeature(props.feature)
  if(!feature) return logNotFound(`feature`, prefix)

  return feature.uuid === parentId
    ? toFeature(props, feature)
    : toRule(props, feature)
}