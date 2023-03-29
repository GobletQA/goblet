import type { TRaceFeature, TRaceStep, TRaceBackgroundParent } from '@GBR/types'

import { findStep, findRule } from '@GBR/utils/find'
import { logNotFound, missing } from '@GBR/utils/logging'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'

const prefix = `[Update Background#Step]`

export type TUpdateBackgroundStep = {
  step:TRaceStep
  feature?:TRaceFeature
  backgroundParentId:string
  granParent:TRaceBackgroundParent
}

const fromFeature = (props:TUpdateBackgroundStep, feature:TRaceFeature) => {
  const {
    step,
  } = props

  if(!feature.background) return missing(`Background on feature. Can not update step`, prefix, feature)
  
  const { step:found, stepIdx, steps } = findStep(feature.background, step.uuid)
  if(!found) return logNotFound(`step`, prefix)

  steps[stepIdx] = step
  const updated = {...feature, background: {...feature.background, steps}}
  !props.feature && updateFeature(updated)

  return updated
}

const fromRule = (props:TUpdateBackgroundStep, feature:TRaceFeature) => {
  const {
    step,
    backgroundParentId,
  } = props

  const {
    rule,
    rules,
    ruleIdx,
  } = findRule(feature, backgroundParentId)
  if(!rule) return logNotFound(`rule`, prefix)
  if(!rule.background) return missing(`Background on rule. Can not update step`, prefix, rule)

  const { step:found, stepIdx, steps } = findStep(rule.background, step.uuid)
  if(!found) return logNotFound(`step`, prefix)

  steps[stepIdx] = step
  rule.background = {...rule.background, steps}
  rules[ruleIdx as number] = rule

  const updated = {...feature, rules}
  !props.feature && updateFeature({...feature, rules})
  
  return updated
}

export const updateBackgroundStep = async (props:TUpdateBackgroundStep) => {
  const { feature } = await getFeature(props.feature)
  if(!feature) return logNotFound(`feature`, prefix)

  return !props.backgroundParentId || props.backgroundParentId === feature.uuid
    ? fromFeature(props, feature)
    : fromRule(props, feature)
}