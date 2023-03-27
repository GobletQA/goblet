import type { TRaceFeature, TRaceGran, TStepDndData } from '@GBR/types'
import { EDndPos } from '@gobletqa/components'
import { ESectionType } from '@GBR/types'
import { emptyObj } from '@keg-hub/jsutils'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'
import { addScenarioStep } from '@GBR/actions/scenario/addScenarioStep'
import { addBackgroundStep } from '@GBR/actions/background/addBackgroundStep'
import { removeScenarioStep } from '@GBR/actions/scenario/removeScenarioStep'
import { removeBackgroundStep } from '@GBR/actions/background/removeBackgroundStep'
import { logNotFound } from '@GBR/utils/logging'
import { findScenario, findRule, findBackground } from '@GBR/utils/find'

const prefix = `[Move Step]`

const getGran = (feature:TRaceFeature, data:TStepDndData) => {
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

const getParent = (feature:TRaceFeature, data:TStepDndData) => {
  const granParent = getGran(feature, data)
  if(!granParent) return

  switch(data.parentType){
    case ESectionType.scenario: {
      const found = findScenario(granParent.gran as TRaceGran, data.parent)
      return found.scenario
        ? {
            gran: granParent,
            parent: found.scenario,
            group: found.scenarios,
            index: found.scenarioIdx,
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

export const moveStep = async (oldData:TStepDndData, newData:TStepDndData, pos:EDndPos) => {
  const { feature } = await getFeature()
  if(!feature) return logNotFound(`feature`, prefix)

  const oldParentData = getParent(feature, oldData)
  if(!oldParentData) return logNotFound(`old parent`, prefix)
  
  const newParentData = getParent(feature, newData)
  if(!newParentData) return logNotFound(`old parent`, prefix)
  
  const { parent:oldParent, remove } = oldParentData
  const { parent:newParent, add } = newParentData
  
  const moveStep = oldParent.steps[oldData.index]
 
  remove(moveStep.uuid, oldParent.uuid)
  add(
    newParent.uuid,
    moveStep,
    pos === EDndPos.before
      ? newData.index
      : newData.index + 1
  )

}