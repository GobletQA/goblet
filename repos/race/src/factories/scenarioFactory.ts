
import type { TRaceFeature, TRaceScenario, TRaceScenarioParent } from '@GBR/types'

import { tagsFactory } from './tagsFactory'
import { EAstObject } from '@ltipton/parkin'
import { stepsFactory } from './stepFactory'
import { findIndex } from '@GBR/utils/find/findIndex'
import { deepMerge, emptyArr } from '@keg-hub/jsutils'

export type TScenariosFactory = {
  empty?:boolean
  feature:TRaceFeature
  parent?:TRaceScenarioParent
  scenarios?:Partial<TRaceScenario>[]|undefined,
}

export type TScenarioFactory = {
  empty?:boolean
  tags?:string[]
  feature: TRaceFeature
  parent?:TRaceScenarioParent
  scenario?:Partial<TRaceScenario>
}

const emptyScenario = (scenario:Partial<TRaceScenario>) => ({
  steps: [],
  scenario: ``,
  type: EAstObject.scenario,
  ...scenario
} as Partial<TRaceScenario>)

export const scenarioFactory = ({
  tags,
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
  const uuid = `${parent.uuid}.${EAstObject.scenario}.${index}`

  const built = scenario
    ? deepMerge<TRaceScenario>(
        emptyScenario({ uuid, index, whitespace }),
        scenario,
      )
    : empty
      ? emptyScenario({ uuid, index, whitespace }) as TRaceScenario
      : undefined
  
  if(!built) return undefined

  if(tags?.length){
    built.index = built.index + 1
    built.tags = tagsFactory({
      tags,
      feature,
      parent: built,
      index: built.index - 1,
    })
  }

  built.steps = stepsFactory({
    feature,
    steps: scenario?.steps,
    parent: built as TRaceScenario,
  })

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