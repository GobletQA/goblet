import type { TRaceFeature } from '@GBR/types'
import type {
  TStepAst,
  TRuleAst,
  TScenarioAst,
  TBackgroundAst,
} from '@ltipton/parkin'

import { deepEqual, emptyObj, flatUnion } from '@keg-hub/jsutils'


const dataMappers = {
  tags: (
    current:string[]=[],
    updated:string[]=[],
  ) => flatUnion(current, updated),
  steps: (current:TStepAst[], updated:TStepAst[]) => {
    if(!current?.length || !updated?.length) return updated || []

    return updated.map(step => {
      const found = (current?.find?.(st => st.uuid === step.uuid) || emptyObj) as TStepAst
      if(!found) return step

      if(deepEqual(found, step)) return found

      return {...found, ...step} as TStepAst
    })
  },
  background: (
    current?:TBackgroundAst,
    updated?:TBackgroundAst,
  ) => {
    if(!current || !updated) return updated || emptyObj

    return {
      background: {
        ...current,
        ...updated,
        steps: dataMappers.steps(current?.steps, updated?.steps)
      }
    }
  },
  scenarios: (
    current?:TScenarioAst[],
    updated?:TScenarioAst[],
  ) => {
    if(!current?.length || !updated?.length) return updated || []

    return updated.map(scenario => {
      const found = (current?.find?.(sc => sc.uuid === scenario.uuid) || emptyObj) as TScenarioAst
      if(!found) return scenario

      if(deepEqual(found, scenario)) return found

      const item = {...found, ...scenario} as TScenarioAst
      item.steps = dataMappers.steps(found.steps, scenario.steps)

      return item
    })
    
  },
  rules: (
    current?:TRuleAst[],
    updated?:TRuleAst[],
  ) => {
    if(!current?.length || !updated?.length) return updated

    return updated.map(rule => {
      const found = (current?.find?.(rl => rl.uuid === rule.uuid) || emptyObj) as TRuleAst
      if(!found) return rule

      if(deepEqual(found, rule)) return found
      
      const item = {...found, ...rule} as TRuleAst
      item.scenarios = dataMappers.scenarios(found.scenarios, rule.scenarios)

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
  updated:TRaceFeature,
  feature:TRaceFeature,
  replace?:boolean
) => {
  return {
    ...updated,
    uuid: updated.uuid || feature.uuid,
    path: updated.path || feature.path,
    index: updated.index || feature.index,
    parent: updated.parent || feature.parent,
    tags: dataMappers.tags(feature.tags, updated.tags),
    rules: dataMappers.rules(feature.rules, updated.rules),
    scenarios: dataMappers.scenarios(feature.scenarios, updated.scenarios),
    ...dataMappers.background(feature.background, updated.background),
  }
}
