import type { TTreeGroup, TTreeItem } from '@gobletqa/components'
import type { TFeaturesRef, TRaceFeature } from '@GBR/types'

import { set } from '@keg-hub/jsutils'
import { useMemo } from 'react'

export type THFeatureGroups = {
  featuresRef: TFeaturesRef
}

export const useFeatureGroups = (props:THFeatureGroups) => {
  const { featuresRef } = props

  console.log(featuresRef.current)

  return useMemo(() => {
    const groups = Object.entries(featuresRef?.current)
      .reduce((groups, [key, feature]) => {
          const { path, title } = feature

          let curr = groups as Record<string, any>
          path.split(`/`)
            .filter(Boolean)
            .forEach((loc) => {

              curr[loc] = curr[loc] || { nodeId: loc }
              if(path.endsWith(loc)){
                curr[loc].label = title || loc
                return
              }
              
              curr[loc].label = loc
              curr[loc].items = curr[loc].items || {}
              curr = curr[loc].items

            })

          return groups
      }, {} as Record<string, TTreeGroup>)

    return groups
  }, [])
}
