import type { TTabItem } from '@gobletqa/components'
import type { TRaceFeatureGroup, TRaceFeatures, TRaceFeatureItem } from '@GBR/types'

import { groupFindArr } from './groupFindArr'
import {get, set, unset} from '@keg-hub/jsutils'

export type TRenameGroup = {
  oldPath:string
  tabs:TTabItem[]
  featureGroup:TRaceFeatureGroup,
  parentGroup:Record<`items`, TRaceFeatures>,
}


const updateChildPaths = (
  featureGroup:TRaceFeatureGroup,
  oldPath:string,
  items:TRaceFeatures
) => {
  return Object.entries(items)
    .reduce((acc, [key, item]) => {
      const fullLoc = item.parent.location.replace(oldPath, featureGroup.path)

      const updated = {
        ...item,
        uuid: fullLoc,
        parent: { uuid: fullLoc, location: fullLoc },
        path: item.path.replace(oldPath, featureGroup.path),
      } as TRaceFeatureItem
      
      if((`items` in updated))
        updated.items = updateChildPaths(
          updated,
          item.path,
          updated.items,
        )

      acc[key] = updated

      return acc
    }, {} as TRaceFeatures)
}

export const renameGroup = ({
  tabs,
  oldPath,
  parentGroup,
  featureGroup,
}:TRenameGroup) => {

  const oldArr = groupFindArr(oldPath)
  const oldGrp = get(parentGroup.items, oldArr)

  unset(parentGroup.items, oldArr)

  const newArr = groupFindArr(featureGroup.path)
  const updated = {
    ...featureGroup,
    items: updateChildPaths(
      featureGroup,
      oldPath,
      {...oldGrp?.items, ...featureGroup.items}
    )
  }

  set(parentGroup.items, newArr, updated)

  return parentGroup
}