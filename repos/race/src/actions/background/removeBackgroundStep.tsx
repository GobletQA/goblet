import type {
  TRaceRule,
  TRaceFeature,
  TRaceBackground,
  TRaceBackgroundParent,
} from '@GBR/types'

import { RedText } from '@gobletqa/components'
import { findBackground } from '@GBR/utils/find'
import { emptyArr, exists } from '@keg-hub/jsutils'
import { logNotFound, missingId } from '@GBR/utils/logging'
import { openYesNo } from '@GBR/actions/general/toggleConfirm'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'

const prefix = `[Remove Background#Step]`

export type TRemoveBackgroundStep = {
  stepId:string,
  persist?:Boolean
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
  props.persist !== false && updateFeature(updated, { removeAuditSteps: true })

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
  props.persist !== false && updateFeature(updated, { removeAuditSteps: true })

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

  const step = background.steps.find(step => step.uuid === props.stepId)

  return new Promise(async (res) => {
    const trimmed = step?.step?.trim()
    const stepTxt = trimmed || `background step `

    openYesNo({
      title: `Delete ${stepTxt}`,
      text: step?.step
        ? (<>Are you sure your want to delete step <b><RedText>{stepTxt}</RedText></b>?</>)
        : (<>Are you sure your want to delete <b><RedText>{stepTxt}</RedText></b>?</>),
      yes: {
        onClick: () => {

          const updated = !rule || !exists<number>(index)
            ? toFeature(props, feature, background)
            : toRule(props, feature, rule, index, background)

          res(updated)
        }
      }
    })
  })

}