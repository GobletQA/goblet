import type { TRaceScenarioParent } from '@GBR/types'

import { missing } from '@GBR/utils/logging'
const prefix = `[Update Scenario Pos]`


export const moveScenario = <T extends TRaceScenarioParent>(
  parent:T,
  oldIdx:number,
  newIdx:number
) => {

  const scenario = parent?.scenarios?.length && parent.scenarios[oldIdx]
  if(!scenario) return missing(`Scenario. Failed to update scenario position.`, prefix)

  const scenarios = [...parent.scenarios]
  scenarios.splice(oldIdx, 1)
  scenarios.splice(newIdx, 0, scenario)

  return {...parent, scenarios}
}
