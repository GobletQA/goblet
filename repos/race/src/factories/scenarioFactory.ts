
import type { TRaceFeature, TRaceScenario, TRaceScenarioParent } from '@GBR/types'

import { EAstObject } from '@ltipton/parkin'
import { stepsFactory } from './stepFactory'
import { findIndex } from '@GBR/utils/find/findIndex'
import { deepMerge, uuid, emptyArr } from '@keg-hub/jsutils'

export type TScenariosFactory = {
  empty?:boolean
  feature:TRaceFeature
  parent?:TRaceScenarioParent
  scenarios?:Partial<TRaceScenario>[]|undefined,
}

export type TScenarioFactory = {
  empty?:boolean
  feature: TRaceFeature
  parent?:TRaceScenarioParent
  scenario?:Partial<TRaceScenario>
}

const emptyScenario = (scenario:Partial<TRaceScenario>) => ({
  steps: [],
  uuid: uuid(),
  scenario: ``,
  type: EAstObject.scenario,
  ...scenario
} as Partial<TRaceScenario>)

export const scenarioFactory = ({
  scenario,
  feature,
  empty=false,
  parent=feature,
}:TScenarioFactory) => {

  const index = findIndex({
    parent,
    feature,
    type:EAstObject.scenarios,
  })

  const whitespace = parent?.whitespace?.length ? `${parent.whitespace}  ` : `  `

  const built = scenario
    ? deepMerge<TRaceScenario>(
        emptyScenario({ index, whitespace }),
        scenario,
      )
    : empty
      ? emptyScenario({ index, whitespace }) as TRaceScenario
      : undefined
  
  built && (
    built.steps = stepsFactory({
      feature,
      steps: scenario?.steps,
      parent: built as TRaceScenario,
    })
  )
  
  return built
}

export const scenariosFactory = ({
  feature,
  scenarios,
  empty=false,
  parent=feature,
}:TScenariosFactory) => {
  return scenarios?.length
    ? scenarios.map(scenario => scenarioFactory({scenario, parent, empty, feature}))
    : emptyArr as TRaceScenario[]
}