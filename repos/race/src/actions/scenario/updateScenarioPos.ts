import type { TRaceFeature, TRaceRule, TRaceScenarioParent } from '@GBR/types'

import { ESectionType } from '@GBR/types'
import { findRule } from '@GBR/utils/find'
import { missing, logNotFound } from '@GBR/utils/logging'
import { moveScenario } from '@GBR/utils/actions/moveScenario'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'

const prefix = `[Update Scenario Pos]`

export type TUpdateScenarioPos = {
  oldIdx:number
  newIdx:number
  parentId: string
  persist?:boolean
  feature?:TRaceFeature
  parentType:ESectionType.rule|ESectionType.feature
}

const fromRule = (
  props:TUpdateScenarioPos,
  feature:TRaceFeature,
) => {

  const {
    oldIdx,
    newIdx,
    persist,
    parentId,
  } = props

  const {
    rule,
    rules,
    ruleIdx,
  } = findRule(feature, parentId)
  if(!rule) return logNotFound(`rule`, prefix)
  if(!rule.scenarios) return missing(`Scenarios on rule. Can not update scenario`, prefix, rule)

  const moved = moveScenario<TRaceRule>(rule, oldIdx, newIdx)
  if(!moved) return

  rules[ruleIdx] = moved
  const updated = {...feature, rules}

  persist !== false && updateFeature(updated, { skipAudit: false })

  return updated
}

const fromFeature = (
  props:TUpdateScenarioPos,
  feature:TRaceFeature,
) => {

  const {
    oldIdx,
    newIdx,
    persist,
  } = props

  if(!feature.scenarios)
    return missing(`Scenarios on feature. Can not update scenario`, prefix, feature)

  const updated = moveScenario<TRaceFeature>(feature, oldIdx, newIdx)

  updated
    && persist !== false
    && updateFeature(updated, { skipAudit: false })

  return updated
}


export const updateScenarioPos = async (props:TUpdateScenarioPos) => {
  const { feature } = await getFeature(props.feature)
  if(!feature) return logNotFound(`feature`, prefix)

  return props.parentType === ESectionType.feature
    ? fromFeature(props, feature)
    : fromRule(props, feature)
}