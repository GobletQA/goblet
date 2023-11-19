
import { ESectionType, TRaceFeature, TRaceScenario, TRaceScenarioParent } from '@GBR/types'

import { tagsFactory } from './tagsFactory'
import { EAstObject } from '@ltipton/parkin'
import { stepsFactory } from './stepFactory'
import { deepMerge, emptyArr, uuid } from '@keg-hub/jsutils'
import { ParkinWorker } from '@GBR/workers/parkin/parkinWorker'

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

export const builtSimpleTags = (
  built:TRaceScenario,
  tags:string[]
) => {
  built.index = built.index + 1
  built.tags = {
    uuid: uuid(),
    tokens: [...tags],
    index: built.index - 1,
    content: tags.join(` `),
    type: ESectionType.tags,
  }

  return built
}

export const simpleScenario = ({
  tags,
  index,
  scenario,
  feature,
  empty=false,
  parent=feature,
}:TScenarioFactory & { index:number }) => {

  const whitespace = parent?.whitespace?.length ? `${parent.whitespace}  ` : `  `
  const sId = `${parent.uuid}.${EAstObject.scenario}.${index}`

  const built = scenario
    ? deepMerge<TRaceScenario>(
        emptyScenario({ uuid: sId, index, whitespace }),
        scenario,
      )
    : empty
      ? emptyScenario({ uuid: sId, index, whitespace }) as TRaceScenario
      : undefined
  
  if(!built) return undefined

  built.steps = []
  tags?.length
    && builtSimpleTags(built, tags)


  return built
}

export const scenarioFactory = async ({
  tags,
  scenario,
  feature,
  empty=false,
  parent=feature,
}:TScenarioFactory) => {

  const index = await ParkinWorker.findIndex({
    parent,
    feature,
    type:EAstObject.scenarios,
  })

  const built = simpleScenario({
    index,
    empty,
    parent,
    feature,
    scenario,
  })

  if(!built) return undefined

  if(tags?.length){
    built.index = built.index + 1
    built.tags = await tagsFactory({
      tags,
      feature,
      parent: built,
      index: built.index - 1,
    })
  }

  built.steps = await stepsFactory({
    feature,
    steps: scenario?.steps,
    parent: built as TRaceScenario,
  })

  return built

}

export const scenariosFactory = async ({
  feature,
  scenarios,
  empty=false,
  parent=feature,
}:TScenariosFactory) => {
  if(!scenarios?.length) return emptyArr as TRaceScenario[]

  const built = await Promise.all(scenarios.map(async (scenario) => await scenarioFactory({scenario, parent, empty, feature})))
  return built.filter(Boolean)

}