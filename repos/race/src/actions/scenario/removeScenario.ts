import type { TRaceFeature, TRaceScenarioParent, TRaceScenario } from '@GBR/types'

import { logNotFound } from '@GBR/utils/logging'
import { findScenario, findRule } from '@GBR/utils/find'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'

const prefix = `[Remove Scenario]`

export type TRemoveScenario = {
  persist?:Boolean
  scenarioId:string
  feature?:TRaceFeature
  parent?:TRaceScenarioParent
}

const toRule = (
  props:TRemoveScenario,
  feature:TRaceFeature,
  parent:TRaceScenarioParent,
  scenarios:TRaceScenario[]
) => {
  const {
    rule,
    rules,
    ruleIdx,
  } = findRule(feature, parent.uuid)
  if(!rule) return logNotFound(`rule`, prefix)

  rules[ruleIdx] = {...rule, scenarios}
  
  const updated = {...feature, rules}
  props.persist !== false && updateFeature(updated)

  return updated
}

const toFeature = (
  props:TRemoveScenario,
  feature:TRaceFeature,
  scenarios:TRaceScenario[]
) => {
  const updated = {...feature, scenarios}
  props.persist !== false && updateFeature(updated)

  return updated
}

export const removeScenario = async (props:TRemoveScenario) => {
  const { scenarioId } = props

  const { feature } = await getFeature(props.feature)
  if(!feature) return logNotFound(`feature`, prefix)

  const {
    parent,
    item:scenario,
    group:scenarios,
  } = findScenario(feature, scenarioId, props.parent)
  if(!scenario) return logNotFound(`scenario`, prefix)

  const updated = scenarios?.filter(scenario => scenario.uuid !== props.scenarioId)

  return parent.uuid === feature.uuid
    ? toFeature(props, feature, updated)
    : toRule(props, feature, parent, updated)
}