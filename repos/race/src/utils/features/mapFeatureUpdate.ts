import type { TRaceFeature } from '@GBR/types'


import { ESectionType } from '@GBR/types'
import { dataMappers } from '../indexes/dataMappers'

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
  if(replace || !feature || feature.uuid !== updated.uuid){
    return {...feature, ...updated}
  }

  const merged = {
    uuid: updated.uuid || feature.uuid,
    path: updated.path || feature.path,
    type: updated.type || feature.type,
    index: updated.index || feature.index,
    reason: updated.reason || feature.reason,
    parent: updated.parent || feature.parent,
    desire: updated.desire || feature.desire,
    perspective: updated.perspective || feature.perspective,
  } as TRaceFeature

  Object.keys(updated).forEach(key => {
    switch(key){
      case ESectionType.scenarios: {
        const scenarios = dataMappers.scenarios(feature.scenarios, updated.scenarios)
        scenarios && (merged.scenarios = scenarios)
        break
      }
      case ESectionType.rules: {
        const rules = dataMappers.rules(feature.rules, updated.rules)
        rules && (merged.rules = rules)
        break
      }
      case ESectionType.background: {
        const background = dataMappers.background(feature.background, updated.background)
        background && (merged.background = background)
        break
      }
      case ESectionType.tags: {
        const tags = dataMappers.tags(feature.tags, updated.tags)
        tags && (merged.tags = tags)
        break
      }
      case ESectionType.empty: {
        const empty = dataMappers.empty(feature.empty, updated.empty)
        empty && (merged.empty = empty)
        break
      }
      case ESectionType.comments: {
        const comments = dataMappers.empty(feature.comments, updated.comments)
        comments && (merged.comments = comments)
        break
      }
    }
  })

  return merged
}
