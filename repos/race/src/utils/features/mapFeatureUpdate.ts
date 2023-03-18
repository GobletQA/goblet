import type {
  TRaceTags,
  TRaceRule,
  TRaceStep,
  TRaceBlock,
  TRaceFeature,
  TRaceScenario,
  TRaceBackground,
  TRaceStepParent,
} from '@GBR/types'

import { deepEqual, flatUnion } from '@keg-hub/jsutils'


const dataMappers = {
  empty: (
    current?:TRaceBlock[],
    updated?:TRaceBlock[],
  ) => {
    if(!updated?.length) return !current?.length ? current || [] : []
    if(!current?.length) return updated || []

    let hasChange = false
    const empty = updated.map(empty => {
      const found = current?.find?.(st => st.uuid === empty.uuid)
      if(deepEqual(found, empty)) return found

      hasChange = true
      return !found ? empty : {...found, ...empty} as TRaceBlock
    })

    return (hasChange ? empty : current || []) as TRaceBlock[]
  },
  tags: (
    current?:TRaceTags,
    updated?:TRaceTags,
  ) => {
    if(!current?.tokens.length)
      return (!updated?.tokens?.length ? current : updated) as TRaceTags

    if(deepEqual(current, updated)) return current as TRaceTags

    const tokens = flatUnion(current?.tokens, updated?.tokens)
    return {
      ...current,
      ...updated,
      tokens,
      content: tokens.join(` `)
    } as TRaceTags
  },
  steps: (
    current:TRaceStep[],
    updated:TRaceStep[]
  ) => {
    if(!updated?.length) return !current?.length ? current : []
    if(!current?.length) return updated || []

    let hasChange = false
    const steps = updated.map(step => {
      const found = current?.find?.(st => st.uuid === step.uuid)

      if(deepEqual(found, step)) return found

      hasChange = true
      return !found ? step : {...found, ...step} as TRaceStep
    })

    return hasChange ? steps : current
  },
  parentSteps: <T extends TRaceStepParent>(
    existing:T,
    updated:T
  ) => {
    const { steps:exSteps, tags:exTags, ...exNoSteps } = existing
    const { steps:uSteps, tags:uTags, ...uNoSteps } = updated

    const tags = dataMappers.tags(exTags, uTags)
    const tagsEql = tags === exTags

    const steps = dataMappers.steps(exSteps, uSteps)
    const stepsEql = steps === exSteps

    if(tagsEql && stepsEql && deepEqual(exNoSteps, uNoSteps)) return existing

    const item = {...exNoSteps, ...uNoSteps, steps} as T

    // Only add tags if they still exist
    if(tags) item.tags = tags

    return item
  },
  background: (
    existing?:TRaceBackground,
    updated?:TRaceBackground,
  ) => {
    if(!updated) return undefined
    if(!existing) return updated

    return dataMappers.parentSteps<TRaceBackground>(existing, updated)
  },
  scenarios: (
    current?:TRaceScenario[],
    updated?:TRaceScenario[],
  ) => {
    if(!updated?.length) return !current?.length ? current || [] : []
    if(!current?.length) return updated || []

    let hasChange = false
    const scenarios = updated.map(scenario => {
      const existing = current?.find?.(sc => sc.uuid === scenario.uuid)

      if(!existing){
        hasChange = true
        return scenario
      }

      const mapped = dataMappers.parentSteps<TRaceScenario>(existing, scenario)
      if(!hasChange) hasChange = mapped === existing

      return mapped
    }).filter(Boolean)

    return hasChange ? scenarios : current
  },
  rules: (
    current?:TRaceRule[],
    updated?:TRaceRule[],
  ) => {
    if(!updated?.length) return !current?.length ? current || [] : []
    if(!current?.length) return updated || []

    let hasChange = false
    const rules = updated.map(rule => {
      const existing = current?.find?.(rl => rl.uuid === rule.uuid)

      if(!existing){
        hasChange = true
        return rule
      }

      const { scenarios:exScenarios, background:exBack, ...exRule } = existing
      const { scenarios:uScenarios, background:UBack, ...uRule } = rule

      const background = dataMappers.background(exBack, UBack)
      const backEql = exBack === background

      const scenarios = dataMappers.scenarios(exScenarios, uScenarios)
      const scenarioEql = scenarios === exScenarios

      if(scenarioEql && backEql && deepEqual(exRule, uRule))
        return existing

      hasChange = true
      const item = {...exRule, ...uRule, scenarios } as TRaceRule

      // Only add the background if the update still has one
      if(background) item.background = background

      return item
    })

    return hasChange ? rules : current
  }
}


/**
 * TODO: update this to allow passing a partial, and only update the properties that exist
 * That way we don't have to iterate over the entire object
 */

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
  if(replace || !feature) return updated as TRaceFeature
  
  const merged = {
    ...updated,
    uuid: updated.uuid || feature.uuid,
    path: updated.path || feature.path,
    index: updated.index || feature.index,
    parent: updated.parent || feature.parent,
    scenarios: dataMappers.scenarios(feature.scenarios, updated.scenarios),
  } as TRaceFeature
  
  const rules = dataMappers.rules(feature.rules, updated.rules)
  rules && (merged.rules = rules)

  const background = dataMappers.background(feature.background, updated.background)
  background && (merged.background = background)

  const tags = dataMappers.tags(feature.tags, updated.tags)
  tags && (merged.tags = tags)

  const empty = dataMappers.empty(feature.empty, updated.empty)
  empty && (merged.empty = empty)

  return merged
}
