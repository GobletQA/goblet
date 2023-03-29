import type {
  TRaceRule,
  TRaceFeature,
  TRaceBackground,
  TRaceBackgroundParent,
} from '@GBR/types'

import { emptyArr, exists } from '@keg-hub/jsutils'
import { findBackground } from '@GBR/utils/find'
import { logNotFound, missingId } from '@GBR/utils/logging'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'

const prefix = `[Remove Background#Step]`

export type TRemoveBackgroundStep = {
  stepId:string,
  stepParentId:string,
  feature?:TRaceFeature
  granParent?:TRaceBackgroundParent
}

const toRule = (
  props:TRemoveBackgroundStep,
  feature:TRaceFeature,
  rule:TRaceRule,
  index:number,
  background:TRaceBackground
) => {
  const rules = [...(feature?.rules || emptyArr)]
  rules[index] = {
    ...rule,
    background: {
      ...background,
      steps: background.steps.filter(step => step.uuid !== props.stepId)
    }
  }

  const updated = {...feature, rules}
  !props.feature && updateFeature(updated)

  return updated
}

const toFeature = (
  props:TRemoveBackgroundStep,
  feature:TRaceFeature,
  background:TRaceBackground
) => {
  const updated = {
    ...feature,
    background: {
      ...background,
      steps: background.steps.filter(step => step.uuid !== props.stepId)
    }
  }
  !props.feature && updateFeature(updated)

  return updated
}

export const removeBackgroundStep = async (props:TRemoveBackgroundStep) => {
  const {
    stepId,
    granParent,
    stepParentId,
  } = props
  
  if(!stepId) return missingId(`step`, prefix)

  const { feature } = await getFeature(props.feature)
  if(!feature) return logNotFound(`feature`, prefix)

  const { background, rule, ruleIdx:index } = findBackground(
    feature,
    stepParentId,
    granParent
  )

  if(!background) return logNotFound(`background`, prefix)

  return !rule || !exists<number>(index)
    ? toFeature(props, feature, background)
    : toRule(props, feature, rule, index, background)
}