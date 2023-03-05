
import type { TScenarioAst } from '@ltipton/parkin'

import { ESectionType, EGherkinKeys } from '@GBR/types'
import { stepsFactory } from './stepFactory'
import { deepMerge, uuid, emptyObj, emptyArr } from '@keg-hub/jsutils'

export type TScenariosFactory = {
  empty?:boolean
  parent?:ESectionType
  scenarios?:Partial<TScenarioAst>[]|undefined,
}

export type TScenarioFactory = {
  empty?:boolean
  parent?:ESectionType
  scenario?:Partial<TScenarioAst>
}

const emptyScenario = (parent:ESectionType):TScenarioAst => ({
  tags: [],
  steps: [],
  uuid: uuid(),
  scenario: `${EGherkinKeys.scenario}: `,
})

export const scenarioFactory = ({
  scenario,
  empty=false,
  parent=ESectionType.feature,
}:TScenarioFactory) => {
  return scenario
    ? deepMerge<TScenarioAst>(
        emptyScenario(parent),
        scenario,
        {steps: stepsFactory({ steps: scenario.steps })}
      )
    : empty
      ? emptyScenario(parent)
      : emptyObj as TScenarioAst
}

export const scenariosFactory = ({
  scenarios,
  empty=false,
  parent=ESectionType.feature
}:TScenariosFactory) => {
  return scenarios?.length
    ? scenarios.map(scenario => scenarioFactory({scenario, empty, parent}))
    : emptyArr as TScenarioAst[]
}