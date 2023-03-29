import type { TRaceFeature, TRaceStep } from '@GBR/types'

import { findRule } from '@GBR/utils/find'
import { missing, logNotFound } from '@GBR/utils/logging'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'

const prefix = `[Update Background Step]`

export type TUpdateBackgroundStepPos = {
  oldIdx:number,
  newIdx:number,
  feature?:TRaceFeature
  backgroundParentId:string
}


const updateStepsPos = (
  steps:TRaceStep[],
  step:TRaceStep,
  oldIdx:number,
  newIdx:number,
) => {
  const updated = [...steps]
  updated.splice(oldIdx, 1)
  updated.splice(newIdx, 0, step)
 
  return updated
}

const fromFeature = (props:TUpdateBackgroundStepPos, feature:TRaceFeature) => {
  const {
    oldIdx,
    newIdx,
  } = props

  if(!feature.background) return logNotFound(`background`, prefix)

  const moveStep = feature.background.steps[oldIdx]
  if(!moveStep) return missing(`Step. Failed to update step position.`, prefix)

  const updated = {
    ...feature,
    background: {
      ...feature.background,
      steps: updateStepsPos(feature.background.steps, moveStep, oldIdx, newIdx)
    }
  } as TRaceFeature

  !props.feature && updateFeature(updated)

  return updated
}

const fromRule = (props:TUpdateBackgroundStepPos, feature:TRaceFeature) => {
  const {
    oldIdx,
    newIdx,
    backgroundParentId
  } = props

  const {
    rule,
    rules,
    ruleIdx,
  } = findRule(feature, backgroundParentId)
  if(!rule) return logNotFound(`rule`, prefix)
  if(!rule.background) return missing(`Background on rule. Can not update step`, prefix, rule)

  const moveStep = rule.background?.steps?.[oldIdx]
  if(!moveStep) return missing(`Step. Failed to update step position.`, prefix)

  rules[ruleIdx as number] = {
    ...rule,
    background: {
      ...rule.background,
      steps: updateStepsPos(rule.background.steps, moveStep, oldIdx, newIdx,)
    }
  }

  const updated = {...feature, rules}
  !props.feature && updateFeature({...feature, rules})
  
  return updated
}

export const updateBackgroundStepPos = async (props:TUpdateBackgroundStepPos) => {
  const { feature } = await getFeature(props.feature)
  if(!feature) return logNotFound(`feature`, prefix)

  return !props.backgroundParentId || props.backgroundParentId === feature.uuid
    ? fromFeature(props, feature)
    : fromRule(props, feature)

}