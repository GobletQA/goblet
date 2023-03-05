
import type { TScenarioAst } from '@ltipton/parkin'

import { ESectionType } from '@GBR/types'
import { stepsFactory } from './stepFactory'
import { deepMerge, uuid, emptyObj, emptyArr } from '@keg-hub/jsutils'

const emptyScenario = (parent:ESectionType):TScenarioAst => ({
  tags: [],
  index: 0,
  steps: [],
  uuid: uuid(),
  whitespace: ``,
  scenario: `${parent} scenario`,
})

export const scenarioFactory = (
  scenario?:Partial<TScenarioAst>,
  empty:boolean=false,
  parent:ESectionType=ESectionType.feature
) => {
  return scenario
    ? deepMerge<TScenarioAst>(
        emptyScenario(parent),
        scenario,
        {steps: stepsFactory(scenario.steps)}
      )
    : empty
      ? emptyScenario(parent)
      : emptyObj as TScenarioAst
}

export const scenariosFactory = (
  scenarios?:Partial<TScenarioAst>[],
  empty:boolean=false
) => {
  return scenarios?.length
    ? scenarios.map(scenario => scenarioFactory(scenario, empty, ESectionType.feature))
    : emptyArr as TScenarioAst[]
}