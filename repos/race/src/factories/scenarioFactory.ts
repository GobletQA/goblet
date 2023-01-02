
import type { TScenarioAst } from '@GBR/types'

import { stepsFactory } from './stepFactory'
import { deepMerge, uuid, emptyObj, emptyArr } from '@keg-hub/jsutils'

export const scenarioFactory = (scenario?:Partial<TScenarioAst>) => {
  return scenario
    ? deepMerge<TScenarioAst>(
        {
          tags: [],
          index: 0,
          uuid: uuid(),
          scenario: ` `,
        },
        scenario,
        {steps: stepsFactory(scenario.steps)}
      )
    : emptyObj as TScenarioAst
}

export const scenariosFactory = (scenarios?:Partial<TScenarioAst>[]) => {
  return scenarios?.length
    ? scenarios.map(scenario => scenarioFactory(scenario))
    : emptyArr as TScenarioAst[]
}