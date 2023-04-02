import type { TRaceFeature, TRaceGran, TDndItemData } from '@GBR/types'

import { ESectionType } from '@GBR/types'
import { EDndPos } from '@gobletqa/components'

import { findScenario, findRule } from '@GBR/utils/find'
import { logNotFound, missing } from '@GBR/utils/logging'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'
import { addScenarioStep } from '@GBR/actions/scenario/addScenarioStep'
import { addBackgroundStep } from '@GBR/actions/background/addBackgroundStep'
import { removeScenarioStep } from '@GBR/actions/scenario/removeScenarioStep'
import { removeBackgroundStep } from '@GBR/actions/background/removeBackgroundStep'

const prefix = `[Move Step]`

export type TMoveStep = {
  pos:EDndPos
  newIdx:number
  oldIdx:number
  persist?:Boolean
  oldData:TDndItemData
  newData:TDndItemData
  feature?:TRaceFeature
}

const getGran = (feature:TRaceFeature, data:TDndItemData) => {
  if(!data.gran || !data.granType || data.granType === ESectionType.feature)
    return { gran: feature }

  const {
    rule,
    rules,
    ruleIdx,
  } = findRule(feature, data.gran)
  return rule
    ? { gran: rule, group: rules, index: ruleIdx }
    : logNotFound(`rule`, prefix)
}

const getParent = (feature:TRaceFeature, data:TDndItemData) => {
  const granParent = getGran(feature, data)
  if(!granParent) return

  switch(data.parentType){
    case ESectionType.scenario: {
      const found = findScenario(feature, data.parent, granParent.gran as TRaceGran)
      return found.item
        ? {
            gran: granParent,
            parent: found.item,
            group: found.group,
            index: found.index,
            add: addScenarioStep,
            remove: removeScenarioStep,
          }
        : logNotFound(`scenario`, prefix)
    }
    case ESectionType.background: {
      const { background } = granParent.gran
      return background
        ? {
            gran: granParent,
            parent: background,
            add: addBackgroundStep,
            remove: removeBackgroundStep,
          }
        : logNotFound(`scenario`, prefix)
    }
  }
  
}

export const moveStep = async (props:TMoveStep) => {
  const {
    pos,
    persist,
    oldData,
    newData,
  } = props

  const { feature } = await getFeature(props.feature)
  if(!feature) return logNotFound(`feature`, prefix)

  const oldParentData = getParent(feature, oldData)
  if(!oldParentData) return logNotFound(`old parent`, prefix)
  
  const newParentData = getParent(feature, newData)
  if(!newParentData) return logNotFound(`old parent`, prefix)
  
  const { parent:oldParent, gran:oldGran, remove } = oldParentData
  const { parent:newParent, gran:newGran, add } = newParentData
  
  const move = oldParent.steps[oldData.index]
 
  const removed = await remove({
    feature,
    persist: false,
    stepId: move.uuid,
    granParent: oldGran.gran,
    stepParentId: oldParent.uuid,
  })

  if(!removed)
    return missing(`Feature. Could not perform "Move step from ${oldParent.type}"`, prefix)

  const added = await add({
    step: move,
    persist: false,
    feature: removed,
    granParent: newGran.gran,
    stepParentId: newParent.uuid,
    index: pos === EDndPos.before ? newData.index : newData.index + 1
  })

  if(!added)
    return missing(`Feature. Could not perform "Move step to ${newParent.type}"`, prefix)

  persist !== false && updateFeature(added)

  return added
}