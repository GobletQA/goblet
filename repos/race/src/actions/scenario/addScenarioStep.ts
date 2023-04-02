import type {
  TRaceStep,
  TRaceFeature,
  TRaceScenario,
  TRaceScenarioParent,
} from '@GBR/types'

import { ESectionType } from '@GBR/types'
import { emptyArr } from '@keg-hub/jsutils'
import { findScenario, findRule } from '@GBR/utils/find'
import { stepFactory } from '@GBR/factories/stepFactory'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'
import { logNotFound, factoryFailed, missingId } from '@GBR/utils/logging'

const prefix = `[Add Scenario#Step]`

export type TAddScenarioStep = {
  index?:number,
  step?:TRaceStep,
  persist?:Boolean
  stepParentId:string,
  feature?:TRaceFeature
  granParent?:TRaceScenarioParent
}

const buildStep = (
  props:TAddScenarioStep,
  feature:TRaceFeature,
  scenario:TRaceScenario,
  index?:number,
) => {
  const steps = [...(scenario?.steps || emptyArr)]
  let step = props.step

  if(step){
    steps.splice(index || steps.length - 1, 0, step)
  }
  else {
    step = stepFactory({
      feature,
      parent: scenario
    })
    if(!step) return factoryFailed(`step`, prefix)

    steps.push(step)
  }

  return {
    step,
    steps,
  }
}

const toRule = (
  props:TAddScenarioStep,
  feature:TRaceFeature,
  sParent: TRaceScenarioParent,
  scenarios:TRaceScenario[],
  step:TRaceStep
) => {

  const {
    rule,
    rules,
    ruleIdx,
  } = findRule(feature, sParent.uuid)
  if(!rule) return logNotFound(`rule`, prefix)

  rules[ruleIdx as number] = {...rule, scenarios}

  const update = {...feature, rules}
  props.persist !== false && updateFeature(update, { expand: step.uuid })

  return update
}

const toFeature = (
  props:TAddScenarioStep,
  feature:TRaceFeature,
  scenarios:TRaceScenario[],
  step:TRaceStep
) => {
  const update = {...feature, scenarios}
  props.persist !== false && updateFeature(update, { expand: step.uuid })

  return update
}

export const addScenarioStep = async (props:TAddScenarioStep) => {
  const {
    index,
    granParent,
    stepParentId,
  } = props

  if(!stepParentId) return missingId(`scenario`, prefix)

  const { feature } = await getFeature(props.feature)
  if(!feature) return logNotFound(`feature`, prefix)

  const {
    item:scenario,
    parent:sParent,
    group:scenarios,
    index:scenarioIdx,
  } = findScenario(feature, stepParentId, granParent)
  if(!scenario) return logNotFound(`scenario`, prefix, stepParentId)

  const added = buildStep(props, feature, scenario, index)
  if(!added) return

  const { steps, step } = added
  scenarios[scenarioIdx] = {...scenario, steps}

  return sParent.type === ESectionType.feature
    ? toFeature(props, feature, scenarios, step)
    : toRule(props, feature, sParent, scenarios, step)
}