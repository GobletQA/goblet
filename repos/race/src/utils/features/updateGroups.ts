import type { TRaceFeatureGroup } from '@GBR/types'

import { EmptyFeatureGroupUUID } from '@GBR/constants/values'

export const updateGroups = (
  parentGroup:Partial<TRaceFeatureGroup>,
  featureGroup:TRaceFeatureGroup,
  replaceEmptyKey?:string
) => {
  let found = false
  const items = Object.entries(parentGroup?.items || {})
    .reduce((acc, [key, item]) => {

      if(!(`items` in item) || found){
        acc[key] = item
        return acc
      }

      if(!replaceEmptyKey && item.uuid === featureGroup.uuid) found = true
      else if(replaceEmptyKey && item.uuid === EmptyFeatureGroupUUID) found = true

      const replace = found ? featureGroup : updateGroups(item, featureGroup, replaceEmptyKey)
      const ref = replaceEmptyKey || key
      acc[ref] = replace

      return acc
    }, {} as TRaceFeatureGroup[`items`])

  if(found) parentGroup.items = items

  return parentGroup as TRaceFeatureGroup
}
