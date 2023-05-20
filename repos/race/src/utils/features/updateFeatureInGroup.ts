import type { TRaceFeatureGroup, TRaceFeature, TRaceFeatures } from '@GBR/types'

import { EmptyFeatureUUID } from '@GBR/constants/values'

export type TFeatureFromLoc = {
  feature:TRaceFeature
  replaceEmptyKey?:string
  features:Partial<TRaceFeatureGroup>
}

export const updateFeatureInGroup = ({
  feature,
  features,
  replaceEmptyKey
}:TFeatureFromLoc) => {
  let found = false
  features.items = Object.entries(features?.items || {})
    .reduce((acc, [key, item]) => {

      if(found){
        acc[key] = item
        return acc
      }

      const uuidMatch = item.uuid === feature.uuid
      const emptyMatch = item.uuid === EmptyFeatureUUID

      if(!replaceEmptyKey && uuidMatch) found = true
      else if(replaceEmptyKey && emptyMatch) found = true

      // If not found, search the group's children
      const replace = found
        ? feature
        : !(`items` in item)
          ? item
          : updateFeatureInGroup({ features: item, feature, replaceEmptyKey })

      // If there was an empty match && replaceEmptyKey exists, then use it
      // Otherwise keep the same key for consistent reference
      const ref = (emptyMatch && replaceEmptyKey) || key

      acc[ref] = replace

      return acc
    }, {} as TRaceFeatureGroup[`items`])

  return features as TRaceFeatureGroup
}