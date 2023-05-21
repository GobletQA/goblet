import type { TRaceFeatureGroup, TRaceFeatures } from '@GBR/types'

import { groupFindArr } from './groupFindArr'
import {set, unset} from '@keg-hub/jsutils'

export type TUpdateGroups = {
  oldPath?:string
  replaceEmptyKey?:string
  featureGroup:TRaceFeatureGroup
  parentGroup:Record<`items`, TRaceFeatures>
}

export const updateGroups = ({
  oldPath,
  parentGroup,
  featureGroup,
  replaceEmptyKey,
}:TUpdateGroups) => {
  const items = {...parentGroup.items}

  if(replaceEmptyKey && oldPath){
    const oldArr = groupFindArr(oldPath)
    unset(items, oldArr)
  }

  const newArr = groupFindArr(featureGroup.path)
  set(items, newArr, featureGroup)

  return {
    items,
  }
}
