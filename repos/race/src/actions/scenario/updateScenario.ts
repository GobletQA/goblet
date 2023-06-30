import type { TRaceFeature, TRaceScenarioParent, TRaceScenario, TUpdateFeatureOpts } from '@GBR/types'

import { logNotFound } from '@GBR/utils/logging'
import { findScenario, findRule } from '@GBR/utils/find'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'

const prefix = `[Update Scenario]`

export type TUpdateScenario = {
  persist?:Boolean
  scenarioId:string,
  feature?:TRaceFeature
  parent?:TRaceScenarioParent
  update:Partial<TRaceScenario>
  featureOpts?:TUpdateFeatureOpts
}

const toRule = (
  props:TUpdateScenario,
  feature:TRaceFeature,
  parent:TRaceScenarioParent,
  scenarios:TRaceScenario[],
  scenario:TRaceScenario,
  index:number
) => {

  const { update, persist, featureOpts } = props

  const {
    rule,
    rules,
    ruleIdx,
  } = findRule(feature, parent.uuid)
  if(!rule) return logNotFound(`rule`, prefix)

  scenarios[index] = {...scenario, ...update}
  rules[ruleIdx as number] = {...rule, scenarios}

  const updated = {...feature, rules}
  persist !== false && updateFeature(updated, { skipAudit: true, ...featureOpts })

  return updated
}

const toFeature = (
  props:TUpdateScenario,
  feature:TRaceFeature,
  scenarios:TRaceScenario[],
  scenario:TRaceScenario,
  index:number
) => {

  const {
    update,
    persist,
    scenarioId,
    featureOpts
  } = props

  if(!scenario)
    return console.warn(`Scenario Id ${scenarioId} could not be found on feature`, feature)

  scenarios[index] = {...scenario, ...update}

  const updated = {...feature, scenarios}
  persist !== false && updateFeature(updated, { skipAudit: true, ...featureOpts })

  return updated
}

export const updateScenario = async (props:TUpdateScenario) => {
  const { scenarioId } = props

  if(!scenarioId) return console.warn(`Can not update scenario step without scenario Id`)
  
  const { feature } = await getFeature(props.feature)
  if(!feature) return logNotFound(`feature`, prefix)

  const {
    index,
    parent,
    item:scenario,
    group:scenarios,
  } = findScenario(feature, scenarioId, props.parent)
  if(!scenario) return logNotFound(`scenario`, prefix, feature)

  return parent.uuid === feature.uuid
    ? toFeature(props, feature, scenarios, scenario, index)
    : toRule(props, feature, parent, scenarios, scenario, index)
}