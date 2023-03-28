import type { TRaceFeature, TRaceScenario, TRaceScenarioParent } from '@GBR/types'


import { emptyObj } from '@keg-hub/jsutils'
import { findFailed } from '@GBR/utils/logging/findFailed'

export type TFoundScenario = {
  index:number
  item?:TRaceScenario
  group:TRaceScenario[]
  parent: TRaceScenarioParent
}

const fromParent = (
  feature:TRaceFeature,
  scenarioId:string,
  parent:TRaceScenarioParent,
  warn?:boolean
):TFoundScenario => {
  const item = parent?.scenarios?.find(scenario => scenario.uuid === scenarioId)
  if(!item)
    return warn
      ? findFailed<TFoundScenario>(emptyObj as TFoundScenario, `Scenario`, parent.type, feature, parent)
      : emptyObj as TFoundScenario

  const group = [...(parent.scenarios || []) ]
  const index = group.indexOf(item)

  return { item, index, group, parent }
}

export const findScenario = (
  feature:TRaceFeature,
  scenarioId:string,
  parent?:TRaceScenarioParent
) => {

  if(parent) return fromParent(feature, scenarioId, parent, true)

  const found = fromParent(feature, scenarioId, feature)
  if(found.item) return found

  if(!feature?.rules?.length)
    return findFailed<TFoundScenario>(emptyObj as TFoundScenario, `Scenario`, `Feature or Rules`, feature, parent)

  return feature.rules.reduce((foundScenario, rule, index) => {
    return foundScenario.item || !rule?.scenarios?.length
      ? foundScenario
      : fromParent(feature, scenarioId, rule)
  }, emptyObj as TFoundScenario)
}