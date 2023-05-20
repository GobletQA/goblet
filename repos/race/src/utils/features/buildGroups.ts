import type { TRaceFeatureGroup, TRaceFeatureItem, TFeaturesRef } from '@GBR/types'

import { emptyObj } from '@keg-hub/jsutils'
import { groupFactory } from '@GBR/factories/groupFactory'
import { EmptyFeatureUUID, EmptyFeatureGroupUUID } from '@GBR/constants/values'

type TEditingRef = Record<`editingGroup`, string|boolean>

export type TBuildFeatureGroups = {
  rootPrefix:string
  featuresRef: TFeaturesRef
}

const addItemToGroup = (
  editingRef:TEditingRef,
  groups:TRaceFeatureGroup,
  item:TRaceFeatureItem,
  part:string,
  loc:string,
) => {
  const existing = groups.items[loc] || emptyObj

  const joined:TRaceFeatureItem = {
    ...existing,
    ...item,
    ...(
      existing && (`items` in existing)
        ? { items: { ...existing.items, ...(item as TRaceFeatureGroup).items } }
        : emptyObj
      )
  }

  if((`items` in joined)){
    if(part === EmptyFeatureGroupUUID || joined.editing){
      joined.editing = true
      editingRef.editingGroup = groups.items[loc].uuid
    }
  }

  groups.items[loc] = joined

  return groups
}
 
const buildPathInGroup = (
  editingRef:TEditingRef,
  groups:TRaceFeatureGroup,
  item:TRaceFeatureItem,
  parts:string[],
  fullLoc:string,
):TRaceFeatureGroup => {

  const part = parts.shift()
  if(!part) return groups

  const loc = `/${part}`
  fullLoc = `${fullLoc}${loc}`

  // If it's the last part of the path, 
  // Then this is where the item should be added
  // So add it and return
  if(!parts.length)
    return addItemToGroup(
      editingRef,
      groups,
      item,
      part,
      loc,
    )

  // Check for an existing item at the path
  // And if it exists, then use it as the parent Groups object
  const found = groups.items[loc] as TRaceFeatureGroup
  if(found){
    groups.items[loc] = buildPathInGroup(
      editingRef,
      found,
      item,
      parts,
      fullLoc,
    )

    return groups
  }

  // If not existing item, then build it
  // This happens when a feature is built before it's parent folder
  // But the duplicate folder should be resolved  when the folder is built
  // When it checks for a found item above
  const built = groupFactory(fullLoc, part, loc)

  // Use the newly built group as the parent group moving forward
  groups.items[loc] = buildPathInGroup(
    editingRef,
    built,
    item,
    parts,
    fullLoc,
  )

  return groups
}


export const buildGroups = ({
  rootPrefix,
  featuresRef,
}:TBuildFeatureGroups) => {

  const editingRef:TEditingRef={editingGroup: false}
  const groups = Object.entries(featuresRef?.current)
    .reduce((groups, [key, item]) => {
      // Skip a feature if it's empty, so it doesn't show in the sidebar
      return item.uuid === EmptyFeatureUUID
        ? groups
        : buildPathInGroup(
            editingRef,
            groups,
            item,
            item.path.split(`/`).filter(Boolean),
            rootPrefix,
          )

    }, { items: {} } as any)

  return {
    ...editingRef,
    groups: groups.items,
  }
}

