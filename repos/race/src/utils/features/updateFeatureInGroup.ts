import type { TRaceFeatureGroup, TRaceFeature, TRaceFeatures } from '@GBR/types'

import { EmptyFeatureUUID } from '@GBR/constants/values'

export type TFeatureFromLoc = {
  feature:TRaceFeature
  replaceEmptyKey?:string
  features:Partial<TRaceFeatureGroup>
}

type TLoopItems = TFeatureFromLoc & {
  foundRef: { found?:boolean }
}

const loopItems = ({
  foundRef,
  feature,
  features,
  replaceEmptyKey
}:TLoopItems) => {

  features.items = Object.entries(features?.items || {})
    .reduce((acc, [key, item]) => {

      if(foundRef.found){
        acc[key] = item
        return acc
      }

      const uuidMatch = item.uuid === feature.uuid
      const emptyMatch = item.uuid === EmptyFeatureUUID
      const hasMatch = uuidMatch || emptyMatch

      if(!replaceEmptyKey && uuidMatch) foundRef.found = true
      else if(replaceEmptyKey && emptyMatch) foundRef.found = true


      const replace = hasMatch && foundRef.found
        ? feature
        : !(`items` in item)
          ? item
          : loopItems({ features: item, feature, replaceEmptyKey, foundRef })

      // If there was an empty match && replaceEmptyKey exists, then use it
      // Otherwise keep the same key for consistent reference
      const ref = (emptyMatch && replaceEmptyKey) || key

      acc[ref] = replace

      return acc
    }, {} as TRaceFeatureGroup[`items`])

  return features as TRaceFeatureGroup
}

export const updateFeatureInGroup = ({
  feature,
  features,
  replaceEmptyKey
}:TFeatureFromLoc) => loopItems({
  feature,
  features,
  replaceEmptyKey,
  foundRef: { found: false }
})