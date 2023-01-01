import type { TFeaturesRef, TRaceFeatures, TSetFeatureGroups } from '@GBR/types'

import { set } from '@keg-hub/jsutils'
import { useMemo, useState, useEffect } from 'react'

export type THFeatureGroups = {
  featuresRef: TFeaturesRef
}

const buildGroups = (featuresRef: TFeaturesRef) => {
  return Object.entries(featuresRef?.current)
    .reduce((groups, [key, feature]) => {
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


export const useFeatureGroups = (props:THFeatureGroups) => {
  const { featuresRef } = props
  const groups = useMemo(() => buildGroups(featuresRef), [])
  const [featureGroups, setFeatureGroups] = useState<TRaceFeatures>(groups)

  // TODO: figure out way to update feature groups when featuresRef changes
  // useEffect(() => {
    
    
    
  // }, [featureGroups])
  
  return [featureGroups, setFeatureGroups] as [TRaceFeatures, TSetFeatureGroups]
}
