import type { TRaceFeature, TRaceFeatureGroup } from '@GBR/types'
import type { TTabItem } from '@gobletqa/components'

import { createFromPath } from '@GBR/utils/features/createFromPath'

export type TAddToGroup = {
  tabs:TTabItem[]
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