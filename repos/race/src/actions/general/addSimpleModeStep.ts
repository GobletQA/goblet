import type {
  TRaceStep,
  TRaceFeature,
  TRaceScenario,
} from '@GBR/types'

import {emptyArr} from '@keg-hub/jsutils'
import { logNotFound } from '@GBR/utils/logging'
import { buildStep } from '@GBR/utils/actions/buildStep'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'
import { findSimpleScenario } from '@GBR/utils/find/findSimpleScenario'

const prefix = `[Add Simple Mode]`

export type TAddSimpleModeStep = {
  step?:TRaceStep
  persist?:boolean
  feature: TRaceFeature
  scenario: TRaceScenario
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

  const { scenario:scn, index } = findSimpleScenario({...props, feature})
  const added = addScenarioStep({...props, scenario:scn})

  if(!added) return

  const { scenario, step } = added
  const scenarios = [...(feature.scenarios || emptyArr)]
  scenarios[index] = scenario

  const update = {...feature, scenarios}

  props.persist !== false && updateFeature(update, { expand: step.uuid, mergeAudit: true })

  return update
}