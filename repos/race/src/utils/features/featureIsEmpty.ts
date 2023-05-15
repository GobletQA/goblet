import type { TRaceFeature } from '@GBR/types'

import { EmptyFeatureUUID } from '@GBR/constants'

export const featureIsEmpty = (feature?:TRaceFeature) => {
  return !feature
    || feature?.uuid === EmptyFeatureUUID
    || !feature?.feature
    || !feature?.content
    || !feature?.content?.trim?.()
}