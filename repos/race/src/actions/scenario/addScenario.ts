import type {
  TRaceFeature,
  TRaceScenario,
  TRaceScenarioParent
} from '@GBR/types'

import { findRule } from '@GBR/utils/find'
import { emptyArr } from '@keg-hub/jsutils'
import { logNotFound, factoryFailed } from '@GBR/utils/logging'
import { scenarioFactory } from '@GBR/factories/scenarioFactory'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'


const prefix = `[Add Scenario]`

export type TAddScenario = {
  index?:number
  parentId:string
  persist?:Boolean
  feature?:TRaceFeature
  scenario?:TRaceScenario
  defaults?:Partial<TRaceScenario>
}

const buildScenario = async (
  props:TAddScenario,
  feature:TRaceFeature,
  parent:TRaceScenarioParent
) => {
  const scenarios = [...(parent?.scenarios || emptyArr)]
  let scenario = props.scenario

  if(scenario)
    scenarios.splice(props.index || scenarios.length - 1, 0, scenario)
  else {
    scenario = await scenarioFactory({
      parent,
      feature,
      empty: true,
      scenario: props.defaults
    })
    if(!scenario) return factoryFailed(`scenario`, prefix)

    scenarios.push(scenario)
  }

  return {
    scenario,
    scenarios,
  }
}

const toRule = async (
  props:TAddScenario,
  feature:TRaceFeature
) => {

  const {
    rule,
    rules,
    ruleIdx,
  } = findRule(feature, props.parentId)
  if(!rule) return logNotFound(`rule`, prefix)

  const built = await buildScenario(props, feature, rule)
  if(!built) return factoryFailed(`scenario`, prefix)
  const { scenarios, scenario } = built

  rules[ruleIdx as number] = {...rule, scenarios}

  const update = {...feature, rules}

  props.persist !== false && updateFeature(update, { expand: scenario.uuid, skipAudit: false })

  return update
}

const toFeature = async (
  props:TAddScenario,
  feature:TRaceFeature,
) => {
  const built = await buildScenario(props, feature, feature)
  if(!built) return factoryFailed(`scenario`, prefix)
  const { scenarios, scenario } = built

  const updated = {...feature, scenarios}

  props.persist !== false && updateFeature(updated, { expand: scenario.uuid, skipAudit: false })

  return updated
}

export const addScenario = async (props:TAddScenario) => {
  const {
    parentId,
  } = props

  const { feature } = await getFeature(props.feature)
  if(!feature) return logNotFound(`feature`, prefix)

  return !parentId || parentId === feature.uuid
    ? await toFeature(props, feature)
    : await toRule(props, feature)
}