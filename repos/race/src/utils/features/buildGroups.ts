import type { TFeaturesRef, TRaceFeatures } from '@GBR/types'

import {emptyObj, exists} from '@keg-hub/jsutils'
import { EmptyFeatureUUID, EmptyFeatureGroupUUID } from '@GBR/constants/values'


export type THFeatureGroups = {
  featuresRef: TFeaturesRef
}

export const buildGroups = (featuresRef:TFeaturesRef) => {

  let editingGroup:string|boolean=false
  const groups = featuresRef?.current
    ? Object.entries(featuresRef?.current)
      .reduce((groups, [key, feature]) => {
          // Skip a feature if it's empty, so it doesn't show in the sidebar
          if(feature.uuid === EmptyFeatureUUID) return groups

          const { path } = feature

          let curr = groups as Record<string, any>
          let curPath:string = ``
          path.split(`/`)
            .filter(Boolean)
            .forEach((loc) => {
              curPath = loc === EmptyFeatureGroupUUID ? loc : `${curPath}/${loc}`

              if(path.endsWith(loc)) return (curr[loc] = feature)

              curr[loc] = curr[loc] || { uuid: loc, path: curPath }

              curr[loc].title = loc
              curr[loc].items = curr[loc].items || {}

              if(exists<boolean>(curr[loc].editing) || curr.uuid === EmptyFeatureGroupUUID){
                editingGroup = curr.uuid
                curr[loc].editing = true
              }

              curr = curr[loc].items
            })

            return groups
        }, {} as TRaceFeatures)
    : emptyObj as TRaceFeatures
  
  return {
    groups,
    editingGroup
  }
}

