import type { TRaceFeature, TRaceFeatureGroup } from '@GBR/types'

import { createFromPath } from '@GBR/utils/features/createFromPath'

export type TAddToGroup = {
  feature:TRaceFeature
  features:Partial<TRaceFeatureGroup>
}

export const addToGroup = ({
  feature,
  features
}:TAddToGroup) => createFromPath(
  features as TRaceFeatureGroup,
  feature,
  feature.path.split(`/`).filter(Boolean),
  feature.uuid,
  feature.path
)