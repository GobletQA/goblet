import type { TTabItem } from '@gobletqa/components'
import type { TRaceFeatures, TRaceFeature } from '@GBR/types'

import { groupFindArr } from './groupFindArr'
import {set, unset} from '@keg-hub/jsutils'

export type TRenameGroup = {
  oldLoc:string
  newLoc:string
  tabs:TTabItem[]
  feature:TRaceFeature,
  features:Record<`items`, TRaceFeatures>,
}

export const renameFeatureInGroup = ({
  tabs,
  oldLoc,
  newLoc,
  feature,
  features,
}:TRenameGroup) => {

  const oldArr = groupFindArr(oldLoc)

  unset(features.items, oldArr)

  const newArr = groupFindArr(newLoc)

  set(features.items, newArr, feature)

  return features
}