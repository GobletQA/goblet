import type { TFeaturesRef, TRaceFeatures, TSetFeatureGroups, TSetFeatureRefs } from '@GBR/types'

import { useMemo, useState, useCallback } from 'react'

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
  const [featureGroups, _setFeatureGroups] = useState<TRaceFeatures>(groups)

  const setFeatureGroups = useCallback((features:TRaceFeatures|TFeaturesRef) => {
    const feats = `current` in features ? features?.current : features
    
    const groups = buildGroups({ current: feats as TRaceFeatures })
    _setFeatureGroups(groups)
  }, [featureGroups])

  const setFeatureRefs = useCallback((features:TRaceFeatures) => {
    featuresRef.current = features
    setFeatureGroups(featuresRef)
  }, [setFeatureGroups])

  return [
    featureGroups,
    setFeatureGroups,
    setFeatureRefs,
  ] as [TRaceFeatures, TSetFeatureGroups, TSetFeatureRefs]
}
