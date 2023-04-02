import type {
  TRaceStep,
  TRaceFeature,
  TRaceScenario,
  TRaceScenarioParent,
} from '@GBR/types'

import { logNotFound } from '@GBR/utils/logging'
import { findStep, findRule, findScenario } from '@GBR/utils/find'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'

const prefix = `[Update Scenario#Step]`

export type TUpdateScenarioStep = {
  step:TRaceStep
  persist?:Boolean
  stepParentId:string
  feature?:TRaceFeature
  granParent?:TRaceScenarioParent
}

const toRule = (
  props:TUpdateScenarioStep,
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

  rules[ruleIdx as number] = {...rule, scenarios}

  const updated = {...feature, rules}
  props.persist !== false && updateFeature(updated)

  return updated
}


const toFeature = (
  props:TUpdateScenarioStep,
  feature:TRaceFeature,
  scenarios:TRaceScenario[]
) => {
  const updated = {...feature, scenarios}
  props.persist !== false && updateFeature(updated)

  return updated
}

export const updateScenarioStep = async (props:TUpdateScenarioStep) => {
  const {
    step,
    granParent,
    stepParentId
  } = props

  const { feature } = await getFeature()
  if(!feature) return logNotFound(`feature`, prefix)

  const {
    item:scenario,
    group:scenarios,
    index:scenarioIdx,
    parent:scenarioParent,
  } = findScenario(feature, stepParentId, granParent)
  if(!scenario) return logNotFound(`scenario`, prefix, feature)
  
  const { stepIdx, steps } = findStep(scenario, step.uuid)
  if(!step) return logNotFound(`step`, prefix, feature)

  steps[stepIdx] = step
  scenarios[scenarioIdx] = {...scenario, steps}

  return scenarioParent.uuid === feature.uuid
    ? toFeature(props, feature, scenarios)
    : toRule(props, feature, scenarioParent, scenarios)
}