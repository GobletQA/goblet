import type { TRaceFeatures, TRaceFeatureGroup } from '@GBR/types'

import { createFromPath } from '@GBR/utils/features/createFromPath'

import { EmptyFeatureUUID } from '@GBR/constants/values'

export type TBuildFeatureGroups = {
  rootPrefix:string
  features: TRaceFeatures
}

export const buildGroups = ({
  rootPrefix,
  features,
}:TBuildFeatureGroups) => Object.entries(features)
  .reduce((groups, [key, item]) => {
    // Skip a feature if it's empty, so it doesn't show in the sidebar
    return item.uuid === EmptyFeatureUUID
      ? groups
      : createFromPath(
          groups,
          item,
          item.path.split(`/`).filter(Boolean),
          rootPrefix,
          item.path
        )

  }, { items: {} } as TRaceFeatureGroup).items
