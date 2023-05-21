import type { TTabItem } from '@gobletqa/components'
import type { TRaceFeatureGroup, TRaceFeatures } from '@GBR/types'

import { EmptyFeatureGroupUUID } from '@GBR/constants/values'

export type TUpdateGroups = {
  tabs:TTabItem[]
  replaceEmptyKey?:string
  featureGroup:TRaceFeatureGroup
  parentGroup:Partial<TRaceFeatureGroup>
}

export const updateGroups = ({
  tabs,
  parentGroup,
  featureGroup,
  replaceEmptyKey,
}:TUpdateGroups) => {
  let found = false
  const items = Object.entries(parentGroup?.items || {})
    .reduce((acc, [key, item]) => {

      if(!(`items` in item) || found){
        acc[key] = item
        return acc
      }

      const uuidMatch = item.uuid === featureGroup.uuid
      const emptyMatch = item.uuid === EmptyFeatureGroupUUID

      if(!replaceEmptyKey && uuidMatch) found = true
      else if(replaceEmptyKey && emptyMatch) found = true

      // If not found, search the group's children
      const replace = !found
        ? updateGroups({
            tabs,
            featureGroup,
            replaceEmptyKey,
            parentGroup: item,
          })
        : featureGroup

      // If there was an empty match && replaceEmptyKey exists, then use it
      // Otherwise keep the same key for consistent reference
      const ref = (emptyMatch && replaceEmptyKey) || key

      acc[ref] = replace

      return acc
    }, {} as TRaceFeatures)

  if(found) parentGroup.items = items

  return parentGroup as TRaceFeatureGroup
}
