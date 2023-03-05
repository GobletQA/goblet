import type { TRaceFeatureAsts, TFeaturesRef } from '@GBR/types'

import { useMemo } from 'react'

export type THFeatureTags = {
  featuresRef: TFeaturesRef
}

export const useFeatureTags = (props:THFeatureTags) => {
  const { featuresRef } = props

  return useMemo(() => {
    return Object.entries(featuresRef.current as TRaceFeatureAsts)
      .reduce((tags, [key, feature]) => {
        feature?.tags?.forEach((tag) => {
          tags[tag] = tags[tag] || []
          !tags[tag].includes(feature.uuid) && tags[tag].push(feature.uuid)
        })

        return tags
      }, {} as Record<string, string[]>)
  }, [])
}