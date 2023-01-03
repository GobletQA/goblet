import type { TFeaturesRef, TRaceFeatures } from '@GBR/types'
import { EmptyFeatureUUID } from '@GBR/constants/values'

export type THFeatureGroups = {
  featuresRef: TFeaturesRef
}

export const buildGroups = (featuresRef: TFeaturesRef) => {
  return Object.entries(featuresRef?.current)
    .reduce((groups, [key, feature]) => {
      // Skip a feature if it's empty, so it doesn't show in the sidebar
      if(feature.uuid === EmptyFeatureUUID) return groups

      const { path } = feature

      let curr = groups as Record<string, any>
      let curPath:string = ``
      path.split(`/`)
        .filter(Boolean)
        .forEach((loc) => {
          
          curPath = `${curPath}/${loc}`

          if(path.endsWith(loc)) return (curr[loc] = feature)

          curr[loc] = curr[loc] || { uuid: loc, path: curPath }
          
          curr[loc].title = loc
          curr[loc].items = curr[loc].items || {}
          curr = curr[loc].items

        })

        return groups
    }, {} as TRaceFeatures)
}

