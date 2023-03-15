import type {
  TRaceRule,
  TRaceStep,
  TRaceBlock,
  TRaceFeature,
  TRaceScenario,
  TRaceBackground
} from '@GBR/types'

import { deepEqual, emptyObj, flatUnion } from '@keg-hub/jsutils'


const dataMappers = {
  tags: (
    current:string[]=[],
    updated:string[]=[],
  ) => flatUnion(current, updated),
  steps: (current:TRaceStep[], updated:TRaceStep[]) => {
    if(!current?.length || !updated?.length) return updated || []

    return updated.map(step => {
      const found = (current?.find?.(st => st.uuid === step.uuid) || emptyObj) as TRaceStep
      if(!found) return step

      if(deepEqual(found, step)) return found

      return {...found, ...step} as TRaceStep
    })
  },
  background: (
    current?:TRaceBackground,
    updated?:TRaceBackground,
  ) => {
    if(!current || !updated) return updated || emptyObj as TRaceBackground

    return {
      ...current,
      ...updated,
      steps: dataMappers.steps(current?.steps, updated?.steps)
    } as TRaceBackground
  },
  scenarios: (
    current?:TRaceScenario[],
    updated?:TRaceScenario[],
  ) => {
    if(!current?.length || !updated?.length) return updated || []

    return updated.map(scenario => {
      const found = (current?.find?.(sc => sc.uuid === scenario.uuid) || emptyObj) as TRaceScenario
      if(!found) return scenario

      if(deepEqual(found, scenario)) return found

      const item = {...found, ...scenario} as TRaceScenario
      item.steps = dataMappers.steps(found.steps, scenario.steps)

      return item
    })
    
  },
  rules: (
    current?:TRaceRule[],
    updated?:TRaceRule[],
  ) => {
    if(!current?.length || !updated?.length) return updated

    return updated.map(rule => {
      const found = (current?.find?.(rl => rl.uuid === rule.uuid) || emptyObj) as TRaceRule
      if(!found) return rule

      if(deepEqual(found, rule)) return found
      
      const item = {...found, ...rule} as TRaceRule
      item.scenarios = dataMappers.scenarios(found.scenarios, rule.scenarios)
      item.background = dataMappers.background(found.background, rule.background)

      return item
    })
  }
}

/**
 * Helper to update only the parts of a feature that have changed
 * May be better then a full update, need to test and validate
 * The benefit would come when rebuilding the UI
 */
export const mapFeatureUpdate = (
  updated:Partial<TRaceFeature>,
  feature?:TRaceFeature,
  replace?:boolean
) => {
  return replace || !feature
    ? updated as TRaceFeature
    : {
        ...updated,
        uuid: updated.uuid || feature.uuid,
        path: updated.path || feature.path,
        index: updated.index || feature.index,
        parent: updated.parent || feature.parent,
        tags: dataMappers.tags(feature.tags, updated.tags),
        rules: dataMappers.rules(feature.rules, updated.rules),
        scenarios: dataMappers.scenarios(feature.scenarios, updated.scenarios),
        background: dataMappers.background(feature.background, updated.background),
      } as TRaceFeature
}
