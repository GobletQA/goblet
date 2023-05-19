import type { TRaceFeatureGroup } from '@GBR/types'

import { EmptyFeatureGroupUUID } from '@GBR/constants/values'

export const updateGroups = (
  parentGroup:Partial<TRaceFeatureGroup>,
  featureGroup:TRaceFeatureGroup,
  replaceEmpty?:boolean
) => {
  let found = false
  const items = Object.entries(parentGroup?.items || {})
    .reduce((acc, [key, item]) => {

      if(!(`items` in item) || found){
        acc[item.path] = item
        return acc
      }

      if(!replaceEmpty && item.uuid === featureGroup.uuid) found = true
      else if(replaceEmpty && item.uuid === EmptyFeatureGroupUUID) found = true

      const replace = found ? featureGroup : updateGroups(item, featureGroup, replaceEmpty)

      acc[replace.uuid] = replace

      return acc
    }, {} as TRaceFeatureGroup[`items`])

  if(found) parentGroup.items = items

  return parentGroup as TRaceFeatureGroup
}
