import type { TRaceStep, TRaceFeature, TRaceScenarioParent, TRaceScenario } from '@GBR/types'

import { ESectionType } from '@GBR/types'
import { RedText } from '@gobletqa/components'
import { findScenario, findRule } from '@GBR/utils/find'
import { logNotFound, missingId } from '@GBR/utils/logging'
import { openYesNo } from '@GBR/actions/general/toggleConfirm'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'

const prefix = `[Remove Scenario#Step]`

export type TRemoveScenarioStep = {
  stepId:string
  persist?:Boolean
  stepParentId?:string
  feature?:TRaceFeature
  granParent?:TRaceScenarioParent
}

const toRule = (
  props:TRemoveScenarioStep,
  feature:TRaceFeature,
  parent:TRaceScenarioParent,
  scenarios:TRaceScenario[]
) => {
  const {
    rule,
    rules,
    ruleIdx,
  } = findRule(feature, parent.uuid)
  if(!rule) return logNotFound(`rule`, prefix)

  rules[ruleIdx as number] = {...rule, scenarios}

  const update = {...feature, rules}
  props.persist !== false && updateFeature(update, { removeAuditSteps: true })
  
  return update
}

const toFeature = (
  props:TRemoveScenarioStep,
  feature:TRaceFeature,
  scenarios:TRaceScenario[]
) => {
  const update = {...feature, scenarios}
  props.persist !== false && updateFeature(update, { removeAuditSteps: true })

  return update
}

export const removeScenarioStep = async (props:TRemoveScenarioStep):Promise<TRaceFeature|undefined|void> => {
  const {
    stepId,
    granParent,
    stepParentId,
  } = props

  const { feature } = await getFeature(props.feature)

  if(!feature) return logNotFound(`feature`, prefix)
  if(!stepParentId) return missingId(`Scenario`, prefix, feature,stepParentId,stepId)
  if(!stepId) return missingId(`Step`, prefix,feature,stepParentId,stepId)

  const {
    item:scenario,
    group:scenarios,
    index:scenarioIdx,
    parent:scenarioParent,
  } = findScenario(
    feature,
    stepParentId,
    granParent
  )
  if(!scenario) return logNotFound(`scenario`, prefix)

  let step:TRaceStep|undefined
  scenarios[scenarioIdx as number] = {
    ...scenario,
    steps: scenario.steps.filter(st => {
      if(st.uuid !== stepId) return true

      step = st
      return false
    })
  }

  const trimmed = step?.step?.trim()
  const stepTxt = trimmed || `scenario step `

  return await openYesNo({
    title: `Delete Scenario Step?`,
    text: trimmed
      ? (<>Are you sure your want to delete step <b><RedText>{stepTxt}</RedText></b>?</>)
      : (<>Are you sure your want to delete <b><RedText>{stepTxt}</RedText></b>?</>),
    yes: {
      onClick: () => {
        return scenarioParent.type === ESectionType.feature
          ? toFeature(props, feature, scenarios)
          : toRule(props, feature, scenarioParent, scenarios)
      }
    }
  }) as Promise<TRaceFeature|undefined|void>

}