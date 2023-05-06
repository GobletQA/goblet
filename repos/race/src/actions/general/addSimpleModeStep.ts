import type {
  TRaceStep,
  TRaceFeature,
  TRaceScenario,
} from '@GBR/types'

import {emptyArr} from '@keg-hub/jsutils'
import { logNotFound } from '@GBR/utils/logging'
import { SimpleScenarioTag } from '@GBR/constants'
import { buildStep } from '@GBR/utils/actions/buildStep'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'
import { findScenarioWithTag } from '@GBR/utils/find/findScenarioWithTag'

const prefix = `[Add Simple Mode]`

export type TAddSimpleModeStep = {
  step?:TRaceStep
  persist?:boolean
  feature: TRaceFeature
  scenario: TRaceScenario
}

const getScenario = ({ feature, scenario }:TAddSimpleModeStep) => {
  
  if(!feature.scenarios.length)
    return {scenario, index: 0}

  const found = findScenarioWithTag(feature.scenarios, SimpleScenarioTag)

  return !found
    ? {scenario, index: 0}
    : {scenario: {...found}, index: feature.scenarios.indexOf(found)}
}

const addScenarioStep = ({ feature, scenario, ...props }:TAddSimpleModeStep) => {
  const added = buildStep<TRaceScenario>(
    feature,
    scenario,
    props.step,
    scenario.index
  )

  if(!added) return

  scenario.steps = added.steps
  return {scenario, step: added.step}
}

export const addSimpleModeStep = async (props:TAddSimpleModeStep) => {  
  const { feature } = await getFeature(props.feature)
  if(!feature) return logNotFound(`feature`, prefix)

  const { scenario:scn, index } = getScenario({...props, feature})
  const added = addScenarioStep({...props, scenario:scn})

  if(!added) return

  const { scenario, step } = added
  const scenarios = [...(feature.scenarios || emptyArr)]
  scenarios[index] = scenario

  const update = {...feature, scenarios}

  props.persist !== false && updateFeature(update, { expand: step.uuid, mergeAudit: true })

  return update
}