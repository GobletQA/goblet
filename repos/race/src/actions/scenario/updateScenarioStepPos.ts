import type { TRaceFeature, TRaceScenario, TRaceStep } from '@GBR/types'

import { findScenario, findRule } from '@GBR/utils/find'
import { missing, logNotFound } from '@GBR/utils/logging'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'

const prefix = `[Update Scenario Step]`

export type TUpdateScenarioStepPos = {
  oldIdx:number,
  newIdx:number,
  scenarioId:string
  feature?:TRaceFeature
  scenarioParentId:string
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
  !props.feature && updateFeature(updated)

  return updated
}

const fromFeature = (
  props:TUpdateScenarioStepPos,
  feature:TRaceFeature,
  scenarios:TRaceScenario[]
) => {

  const updated = {...feature, scenarios}
  !props.feature && updateFeature(updated)

  return updated
}

export const updateScenarioStepPos = async (props:TUpdateScenarioStepPos) => {
  const {
  scenarioId,
  oldIdx,
  newIdx,
  } = props
  
  const { feature } = await getFeature()
  if(!feature) return logNotFound(`feature`, prefix)

  const {
    parent,
    item:scenario,
    group:scenarios,
    index:scenarioIdx,
  } = findScenario(feature, scenarioId)
  if(!scenario) return logNotFound(`scenario`, prefix)

  const moveStep = scenario.steps[oldIdx]
  if(!moveStep) return missing(`Step. Failed to update step position.`, prefix)

  const steps = [...scenario.steps]
  steps.splice(oldIdx, 1)
  steps.splice(newIdx, 0, moveStep)

  scenarios[scenarioIdx] = {...scenario, steps}

  return parent.uuid === feature.uuid
    ? fromFeature(props, feature, scenarios)
    : fromRule(props, feature, scenarios)
}