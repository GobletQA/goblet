import type { TRaceFeature, TRaceRule, TRaceBackground, TRaceStep } from '@GBR/types'

import { emptyArr } from '@keg-hub/jsutils'
import { findBackground } from '@GBR/utils/find'
import { stepFactory } from '@GBR/factories/stepFactory'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'
import { logNotFound, factoryFailed, missingId } from '@GBR/utils/logging'

const prefix = `[Add Background#Step]`

export type TAddBackgroundStep = {
  index?:number,
  stepParentId:string,
  step?:TRaceStep,
  feature?:TRaceFeature
}

const addStep = (
  props:TAddBackgroundStep,
  feature:TRaceFeature,
  background:TRaceBackground,
  index?:number,
) => {
  let step = props.step
  if(step){
    background.steps = [...(background.steps || emptyArr)]
    background.steps.splice(index || background.steps.length - 1, 0, step)
  }
  else {
    step = stepFactory({
      feature,
      parent: background
    })
    if(!step) return factoryFailed(`step`, prefix)

    background.steps = [...(background.steps || emptyArr), step]
  }

  return {
    step,
    background,
  }
}

const toRule = (
  props:TAddBackgroundStep,
  feature:TRaceFeature,
  rule:TRaceRule,
  ruleIdx:number,
  background:TRaceBackground,
  step:TRaceStep
) => {
  const rules = [...(feature?.rules || emptyArr)]
  rules[ruleIdx] = {...rule, background}

  const updated = {...feature, rules}
  !props.feature && updateFeature(updated, { expand: step.uuid })

  return updated
}

const toFeature = (
  props:TAddBackgroundStep,
  feature:TRaceFeature,
  background:TRaceBackground,
  step:TRaceStep
) => {
  const updated = {...feature, background}
  !props.feature && updateFeature(updated, { expand: step.uuid })

  return updated
}

export const addBackgroundStep = async (props:TAddBackgroundStep) => {
  const {
    index,
    stepParentId,
  } = props
  
  if(!stepParentId) return missingId(`background`, prefix)

  const { feature } = await getFeature(props.feature)
  if(!feature) return logNotFound(`feature`, prefix)

  const { rule, ruleIdx, ...found } = findBackground(feature, stepParentId)
  if(!found.background) return logNotFound(`background`, prefix)

  const added = addStep(props, feature, found.background, index)
  if(!added) return

  const { background, step } = added

  return !rule || !ruleIdx
    ? toFeature(props, feature, background, step)
    : toRule(props, feature, rule, ruleIdx, background, step)

}