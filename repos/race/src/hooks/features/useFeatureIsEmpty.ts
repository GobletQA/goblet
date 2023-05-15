import type { TRaceFeature } from '@GBR/types'

import { useMemo } from 'react'
import { featureIsEmpty } from '@GBR/utils/features/featureIsEmpty'

export type THFeatureIsEmpty = {
  feature?:TRaceFeature
}

export const useFeatureIsEmpty = ({feature}:THFeatureIsEmpty) => {
  return useMemo(() => featureIsEmpty(feature), [
    feature?.uuid,
    feature?.content,
    feature?.feature,
  ])
}