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
  stepParentId:string
  feature?:TRaceFeature
  parent?:TRaceScenarioParent
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
  !props.feature && updateFeature(updated)

  return updated
}


const toFeature = (
  props:TUpdateScenarioStep,
  feature:TRaceFeature,
  scenarios:TRaceScenario[]
) => {
  const updated = {...feature, scenarios}
  !props.feature && updateFeature(updated)

  return updated
}

export const updateScenarioStep = async (props:TUpdateScenarioStep) => {
  const {
    step,
    stepParentId
  } = props

  const { feature } = await getFeature()
  if(!feature) return logNotFound(`feature`, prefix)

  const {
    parent,
    item:scenario,
    group:scenarios,
    index:scenarioIdx,
  } = findScenario(feature, stepParentId, props.parent)
  if(!scenario) return logNotFound(`scenario`, prefix, feature)
  
  const { stepIdx, steps } = findStep(scenario, step.uuid)
  if(!step) return logNotFound(`step`, prefix, feature)

  steps[stepIdx] = step
  scenarios[scenarioIdx] = {...scenario, steps}

  return parent.uuid === feature.uuid
    ? toFeature(props, feature, scenarios)
    : toRule(props, feature, parent, scenarios)
}