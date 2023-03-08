import type { TScenarioAst } from '@ltipton/parkin'
import type { TScenarioParentAst } from '@GBR/types'

import { emptyObj } from '@keg-hub/jsutils'


export type TFoundScenario = {
  scenarioIdx:number
  scenario?:TScenarioAst
  scenarios:TScenarioAst[]
}

export const findScenario = (
  parent:TScenarioParentAst,
  scenarioId:string
) => {

  const scenario = parent?.scenarios?.find(scenario => scenario.uuid === scenarioId)
  if(!scenario){
    console.warn(`Scenario Id ${scenarioId} could not be found`, parent, parent?.scenarios)
    return emptyObj as TFoundScenario
  }

  const scenarios = [...(parent.scenarios || []) ]
  const scenarioIdx = scenarios.indexOf(scenario)

  return {
    scenario,
    scenarios,
    scenarioIdx
  } as TFoundScenario

}