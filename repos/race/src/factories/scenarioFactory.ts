
import type { TRaceFeature, TRaceScenario } from '@GBR/types'

import { ESectionType } from '@GBR/types'
import { stepsFactory } from './stepFactory'
import { deepMerge, uuid, emptyObj, emptyArr } from '@keg-hub/jsutils'

export type TScenariosFactory = {
  empty?:boolean
  feature: TRaceFeature
  scenarios?:Partial<TRaceScenario>[]|undefined,
}

export type TScenarioFactory = {
  empty?:boolean
  feature: TRaceFeature
  scenario?:Partial<TRaceScenario>
}

const emptyScenario = () => ({
  steps: [],
  uuid: uuid(),
  scenario: ``,
  whitespace: `  `,
  type: ESectionType.scenario,
} as Partial<TRaceScenario>)

export const scenarioFactory = ({
  scenario,
  feature,
  empty=false,
}:TScenarioFactory) => {
  return scenario
    ? deepMerge<TRaceScenario>(
        emptyScenario(),
        scenario,
        {steps: stepsFactory({ steps: scenario.steps, feature })}
      )
    : empty
      ? emptyScenario() as TRaceScenario
      : emptyObj as TRaceScenario
}

export const scenariosFactory = ({
  feature,
  scenarios,
  empty=false,
}:TScenariosFactory) => {
  return scenarios?.length
    ? scenarios.map(scenario => scenarioFactory({scenario, empty, feature}))
    : emptyArr as TRaceScenario[]
}