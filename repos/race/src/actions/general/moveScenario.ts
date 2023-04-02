import type { TRaceFeature, TDndItemData } from '@GBR/types'

import { ESectionType } from '@GBR/types'
import { EDndPos } from '@gobletqa/components'

import { findRule } from '@GBR/utils/find'
import { logNotFound, missing } from '@GBR/utils/logging'
import { addScenario } from '@GBR/actions/scenario/addScenario'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { removeScenario } from '@GBR/actions/scenario/removeScenario'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'

const prefix = `[Move Scenario]`

const getParent = (
  feature:TRaceFeature,
  data:TDndItemData
) => {
  switch(data.parentType){
    case ESectionType.feature: {
      return { parent: feature, index: feature.index }
    }
    case ESectionType.rule: {
      const { rule, ruleIdx } = findRule(feature, data.parent)
      return rule
        ? { parent: rule, index: ruleIdx }
        : logNotFound(`rule`, prefix)
    }
    default: {
      console.warn(`${prefix} Unknown parent type`)
      return undefined
    }
  }
}

export type TMoveScenario = {
  pos:EDndPos
  persist?:Boolean
  oldData:TDndItemData
  newData:TDndItemData
}

export const moveScenario = async (props:TMoveScenario) => {
  const {
    pos,
    oldData,
    newData,
  } = props

  const { feature } = await getFeature()
  if(!feature) return logNotFound(`feature`, prefix)

  const oldParentData = getParent(feature, oldData)
  if(!oldParentData) return logNotFound(`old parent`, prefix)
  
  const newParentData = getParent(feature, newData)
  if(!newParentData) return logNotFound(`old parent`, prefix)
  
  const { parent:oldParent } = oldParentData
  const { parent:newParent } = newParentData

  const move = oldParent.scenarios[oldData.index]
 
  const removed = await removeScenario({
    feature,
    persist: false,
    parent: oldParent,
    scenarioId: move.uuid,
  })

  if(!removed)
    return missing(`Feature. Could not perform "Move scenario from ${oldParent.type}"`, prefix)

  const added = await addScenario({
    persist: false,
    scenario: move,
    feature: removed,
    parentId: newParent.uuid,
    index: pos === EDndPos.before ? newData.index : newData.index + 1
  })

  if(!added)
    return missing(`Feature. Could not perform "Move scenario to ${newParent.type}"`, prefix)

  updateFeature(added)
}