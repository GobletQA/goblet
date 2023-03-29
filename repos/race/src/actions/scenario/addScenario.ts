import type { TRaceFeature } from '@GBR/types'

import { findRule } from '@GBR/utils/find'
import { emptyArr } from '@keg-hub/jsutils'
import { logNotFound, factoryFailed } from '@GBR/utils/logging'
import { scenarioFactory } from '@GBR/factories/scenarioFactory'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'


const prefix = `[Add Scenario]`

export type TAddScenario = {
  parentId:string
  feature?:TRaceFeature
}

const toRule = (
  props:TAddScenario,
  feature:TRaceFeature
) => {

  const {
    rule,
    rules,
    ruleIdx,
  } = findRule(feature, props.parentId)
  if(!rule) return logNotFound(`rule`, prefix)

  const scenario = scenarioFactory({ feature, empty: true, parent:rule})
  if(!scenario) return factoryFailed(`scenario`, prefix)

  const scenarios = [...(rule.scenarios || emptyArr), scenario]
  rules[ruleIdx as number] = {...rule, scenarios}

  const update = {...feature, rules}
  !props.feature && updateFeature(update, { expand: scenario.uuid })

  return update
}

const toFeature = (
  props:TAddScenario,
  feature:TRaceFeature,
) => {

  const scenario = scenarioFactory({ feature, empty: true})
  if(!scenario) return factoryFailed(`scenario`, prefix)

  const updated = {...feature, scenarios: [...(feature.scenarios || emptyArr), scenario]}
  !props.feature && updateFeature(updated, { expand: scenario.uuid })

  return updated
}

export const addScenario = async (props:TAddScenario) => {
  const {
    parentId
  } = props
  
  const { feature } = await getFeature(props.feature)
  if(!feature) return logNotFound(`feature`, prefix)

  return !parentId || parentId === feature.uuid
    ? toFeature(props, feature)
    : toRule(props, feature)
}