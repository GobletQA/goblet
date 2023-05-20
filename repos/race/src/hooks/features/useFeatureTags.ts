import type { TRaceFeatures } from '@GBR/types'

import { useMemo } from 'react'
import {uniqArr} from '@keg-hub/jsutils'
import { useEditor } from '@GBR/contexts/EditorContext'

const loopFeatures = (
  features:TRaceFeatures,
  tags:string[]
):string[] => {
  return Object.entries(features)
    .reduce((tags, [key, feature]) => {
      ;(`items` in feature)
        ? tags.concat(loopFeatures(feature.items, tags))
        : feature?.tags?.tokens?.forEach((tag) => !tags.includes(tag) && tags.push(tag))

      return tags
    }, tags)
}


export const useFeatureTags = () => {
  const { featureGroups } = useEditor()

  return useMemo(() => {
    const tags = loopFeatures(featureGroups, [])

    // The types in uniqArr are broken
    // @ts-ignore
    return uniqArr(tags)
  }, [])
}