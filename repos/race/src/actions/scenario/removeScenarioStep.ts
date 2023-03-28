import type { TRaceFeature, TRaceScenarioParent } from '@GBR/types'

import { ESectionType } from '@GBR/types'
import { findScenario, findRule } from '@GBR/utils/find'
import { logNotFound, missingId } from '@GBR/utils/logging'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'


const prefix = `[Remove Scenario#Step]`

export const removeScenarioStep = async (
  stepId:string,
  scenarioId?:string,
  parent?:TRaceScenarioParent,
  parentFeat?:TRaceFeature
) => {

  const { feature } = await getFeature(parentFeat)

  if(!feature) return logNotFound(`feature`, prefix)
  if(!scenarioId) return missingId(`Scenario`, prefix, feature,scenarioId,stepId)
  if(!stepId) return missingId(`Step`, prefix,feature,scenarioId,stepId)

  const {
    parent:sParent,
    item:scenario,
    group:scenarios,
    index:scenarioIdx,
  } = findScenario(feature, scenarioId, parent)
  if(!scenario) return

  scenarios[scenarioIdx as number] = {
    ...scenario,
    steps: scenario.steps.filter(step => step.uuid !== stepId)
  }
  
  if(sParent.type === ESectionType.feature){
    const update = {...feature, scenarios}
    !parentFeat && updateFeature(update)

    return update
  }

  const {
    rule,
    rules,
    ruleIdx,
  } = findRule(feature, sParent.uuid)
  if(!rule) return logNotFound(`rule`, prefix)

  rules[ruleIdx as number] = {...rule, scenarios}

  const update = {...feature, rules}
  !parentFeat && updateFeature(update)
  
  return update
}