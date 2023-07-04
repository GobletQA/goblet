import type { TRaceFeature, TRaceScenarioParent, TRaceScenario } from '@GBR/types'

import { RedText } from '@gobletqa/components'
import { logNotFound } from '@GBR/utils/logging'
import { findScenario, findRule } from '@GBR/utils/find'
import { openYesNo } from '@GBR/actions/general/toggleConfirm'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'

const prefix = `[Remove Scenario]`

export type TRemoveScenario = {
  force?:boolean
  persist?:boolean
  scenarioId:string
  feature?:TRaceFeature
  parent?:TRaceScenarioParent
}

const toRule = (
  props:TRemoveScenario,
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

  rules[ruleIdx] = {...rule, scenarios}
  
  const updated = {...feature, rules}
  props.persist !== false && updateFeature(updated, { removeAuditSteps: true })

  return updated as TRaceFeature
}

const toFeature = (
  props:TRemoveScenario,
  feature:TRaceFeature,
  scenarios:TRaceScenario[]
) => {
  const updated = {...feature, scenarios}
  props.persist !== false && updateFeature(updated, { removeAuditSteps: true })

  return updated as TRaceFeature
}

export const removeScenario = async (props:TRemoveScenario):Promise<TRaceFeature|void> => {
  const { force, scenarioId } = props

  const { feature } = await getFeature(props.feature)
  if(!feature) return logNotFound(`feature`, prefix)

  const {
    parent,
    item:scenario,
    group:scenarios,
  } = findScenario(feature, scenarioId, props.parent)
  if(!scenario) return logNotFound(`scenario`, prefix)

  const removed = scenarios?.filter(scenario => scenario.uuid !== props.scenarioId)

  return await openYesNo<TRaceFeature>({
    force,
    title: `Delete Scenario?`,
    text: (
      <>
        Are you sure your want to delete scenario <b><RedText>{scenario.scenario}</RedText></b>?
      </>
    ),
    yes: {
      onClick: () => {
        return parent.uuid === feature.uuid
          ? toFeature(props, feature, removed)
          : toRule(props, feature, parent, removed)
      }
    }
  })
}