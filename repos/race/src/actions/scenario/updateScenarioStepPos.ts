import type { TRaceFeature, TRaceScenario, TRaceScenarioParent } from '@GBR/types'

import { moveStep } from '@GBR/utils/actions/moveStep'
import { findScenario, findRule } from '@GBR/utils/find'
import { missing, logNotFound } from '@GBR/utils/logging'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'

const prefix = `[Update Scenario Step Pos]`

export type TUpdateScenarioStepPos = {
  oldIdx:number
  newIdx:number
  persist?:Boolean
  scenarioId:string
  feature?:TRaceFeature
  scenarioParentId:string
  granParent?:TRaceScenarioParent
}

const fromRule = (
  props:TUpdateScenarioStepPos,
  feature:TRaceFeature,
  scenarios:TRaceScenario[]
) => {

  const {
    rule,
    rules,
    ruleIdx,
  } = findRule(feature, props.scenarioParentId)
  if(!rule) return logNotFound(`rule`, prefix)
  if(!rule.scenarios) return missing(`Background on rule. Can not update step`, prefix, rule)

  rules[ruleIdx] = {...rule, scenarios}

  const updated = {...feature, rules}
  props.persist !== false && updateFeature(updated)

  return updated
}

const fromFeature = (
  props:TUpdateScenarioStepPos,
  feature:TRaceFeature,
  scenarios:TRaceScenario[]
) => {

  const updated = {...feature, scenarios}
  props.persist !== false && updateFeature(updated)

  return updated
}

export const updateScenarioStepPos = async (props:TUpdateScenarioStepPos) => {
  const {
  oldIdx,
  newIdx,
  granParent,
  scenarioId,
  } = props

  const { feature } = await getFeature()
  if(!feature) return logNotFound(`feature`, prefix)

  const {
    parent,
    item:scenario,
    group:scenarios,
    index:scenarioIdx,
  } = findScenario(feature, scenarioId, granParent)
  if(!scenario) return logNotFound(`scenario`, prefix)
  if(!scenario.steps) return missing(`Steps on Scenario. Can not update step`, prefix, scenario)

  const moved = moveStep<TRaceScenario>(scenario, oldIdx, newIdx)
  if(!moved) return

  scenarios[scenarioIdx] = moved

  return parent.uuid === feature.uuid
    ? fromFeature(props, feature, scenarios)
    : fromRule(props, feature, scenarios)
}