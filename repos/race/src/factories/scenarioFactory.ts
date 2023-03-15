
import type { TRaceScenario } from '@GBR/types'

import { EGherkinKeys } from '@GBR/types'
import { stepsFactory } from './stepFactory'
import { deepMerge, uuid, emptyObj, emptyArr } from '@keg-hub/jsutils'

export type TScenariosFactory = {
  empty?:boolean
  scenarios?:Partial<TRaceScenario>[]|undefined,
}

export type TScenarioFactory = {
  empty?:boolean
  scenario?:Partial<TRaceScenario>
}

const emptyScenario = ():TRaceScenario => ({
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
    ? deepMerge<TRaceScenario>(
        emptyScenario(),
        scenario,
        {steps: stepsFactory({ steps: scenario.steps })}
      )
    : empty
      ? emptyScenario()
      : emptyObj as TRaceScenario
}

export const scenariosFactory = ({
  scenarios,
  empty=false,
}:TScenariosFactory) => {
  return scenarios?.length
    ? scenarios.map(scenario => scenarioFactory({scenario, empty}))
    : emptyArr as TRaceScenario[]
}