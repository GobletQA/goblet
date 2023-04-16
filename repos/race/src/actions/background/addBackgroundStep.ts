import type {
  TRaceRule,
  TRaceStep,
  TRaceFeature,
  TRaceBackground,
  TRaceBackgroundParent,
} from '@GBR/types'

import { findBackground } from '@GBR/utils/find'
import { emptyArr, exists } from '@keg-hub/jsutils'
import { stepFactory } from '@GBR/factories/stepFactory'
import { buildStep } from '@GBR/utils/actions/buildStep'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'
import { logNotFound, factoryFailed, missingId } from '@GBR/utils/logging'

const prefix = `[Add Background#Step]`

export type TAddBackgroundStep = {
  index?:number,
  step?:TRaceStep,
  persist?:Boolean
  stepParentId:string,
  feature?:TRaceFeature
  granParent?:TRaceBackgroundParent
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
  props.persist !== false && updateFeature(updated, { expand: step.uuid, mergeAudit: true })

  return updated
}

const toFeature = (
  props:TAddBackgroundStep,
  feature:TRaceFeature,
  background:TRaceBackground,
  step:TRaceStep
) => {
  const updated = {...feature, background}
  props.persist !== false && updateFeature(updated, { expand: step.uuid, mergeAudit: true })

  return updated
}

export const addBackgroundStep = async (props:TAddBackgroundStep) => {
  const {
    index,
    granParent,
    stepParentId,
  } = props

  if(!stepParentId) return missingId(`background`, prefix)

  const { feature } = await getFeature(props.feature)
  if(!feature) return logNotFound(`feature`, prefix)

  const {
    rule,
    ruleIdx,
    background,
  } = findBackground(feature, stepParentId, granParent)
  if(!background) return logNotFound(`background`, prefix)

  const added = buildStep<TRaceBackground>(feature, background, props.step, index)
  if(!added) return

  const { steps, step } = added
  background.steps = steps

  return !rule || !exists<number>(ruleIdx)
    ? toFeature(props, feature, background, step)
    : toRule(props, feature, rule, ruleIdx, background, step)

}