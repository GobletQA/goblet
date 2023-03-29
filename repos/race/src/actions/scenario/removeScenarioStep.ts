import type { TRaceFeature, TRaceScenarioParent, TRaceScenario } from '@GBR/types'

import { ESectionType } from '@GBR/types'
import { findScenario, findRule } from '@GBR/utils/find'
import { logNotFound, missingId } from '@GBR/utils/logging'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'

const prefix = `[Remove Scenario#Step]`

export type TRemoveScenarioStep = {
  stepId:string
  stepParentId?:string
  feature?:TRaceFeature
  parent?:TRaceScenarioParent
}

const toRule = (
  props:TRemoveScenarioStep,
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

  const update = {...feature, rules}
  !props.feature && updateFeature(update)
  
  return update
}

const toFeature = (
  props:TRemoveScenarioStep,
  feature:TRaceFeature,
  scenarios:TRaceScenario[]
) => {
  const update = {...feature, scenarios}
  !props.feature && updateFeature(update)

  return update
}

export const removeScenarioStep = async (props:TRemoveScenarioStep) => {
  const {
    stepId,
    stepParentId,
  } = props

  const { feature } = await getFeature(props.feature)

  if(!feature) return logNotFound(`feature`, prefix)
  if(!stepParentId) return missingId(`Scenario`, prefix, feature,stepParentId,stepId)
  if(!stepId) return missingId(`Step`, prefix,feature,stepParentId,stepId)

  const {
    parent,
    item:scenario,
    group:scenarios,
    index:scenarioIdx,
  } = findScenario(
    feature,
    stepParentId,
    props.parent
  )
  if(!scenario) return logNotFound(`scenario`, prefix)

  scenarios[scenarioIdx as number] = {
    ...scenario,
    steps: scenario.steps.filter(step => step.uuid !== stepId)
  }

  return parent.type === ESectionType.feature
    ? toFeature(props, feature, scenarios)
    : toRule(props, feature, parent, scenarios)

}