
import type { TScenarioAst } from '@GBR/types'

import { stepsFactory } from './stepFactory'
import { deepMerge, uuid, emptyObj, emptyArr } from '@keg-hub/jsutils'

const emptyScenario = ():TScenarioAst => ({
  tags: [],
  index: 0,
  steps: [],
  uuid: uuid(),
  scenario: ` `,
})

export const scenarioFactory = (
  scenario?:Partial<TScenarioAst>,
  empty:boolean=false
) => {
  return scenario
    ? deepMerge<TScenarioAst>(
        emptyScenario(),
        scenario,
        {steps: stepsFactory(scenario.steps)}
      )
    : empty
      ? emptyScenario()
      : emptyObj as TScenarioAst
}

export const scenariosFactory = (
  scenarios?:Partial<TScenarioAst>[],
  empty:boolean=false
) => {
  return scenarios?.length
    ? scenarios.map(scenario => scenarioFactory(scenario, empty))
    : emptyArr as TScenarioAst[]
}