
import type { TScenarioAst } from '@ltipton/parkin'

import { EGherkinKeys } from '@GBR/types'
import { stepsFactory } from './stepFactory'
import { deepMerge, uuid, emptyObj, emptyArr } from '@keg-hub/jsutils'

export type TScenariosFactory = {
  empty?:boolean
  scenarios?:Partial<TScenarioAst>[]|undefined,
}

export type TScenarioFactory = {
  empty?:boolean
  scenario?:Partial<TScenarioAst>
}

const emptyScenario = ():TScenarioAst => ({
  tags: [],
  steps: [],
  uuid: uuid(),
  scenario: ``,
  whitespace: `  `,
})

export const scenarioFactory = ({
  scenario,
  empty=false,
}:TScenarioFactory) => {
  return scenario
    ? deepMerge<TScenarioAst>(
        emptyScenario(),
        scenario,
        {steps: stepsFactory({ steps: scenario.steps })}
      )
    : empty
      ? emptyScenario()
      : emptyObj as TScenarioAst
}

export const scenariosFactory = ({
  scenarios,
  empty=false,
}:TScenariosFactory) => {
  return scenarios?.length
    ? scenarios.map(scenario => scenarioFactory({scenario, empty}))
    : emptyArr as TScenarioAst[]
}