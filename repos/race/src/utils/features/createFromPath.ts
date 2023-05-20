import type { TRaceFeatureGroup, TRaceFeatureItem, TRaceFeatures } from '@GBR/types'

import { emptyObj, exists } from '@keg-hub/jsutils'
import { groupFactory } from '@GBR/factories/groupFactory'
import { EmptyFeatureGroupUUID } from '@GBR/constants/values'

const addGroupProps = (
  existing:TRaceFeatureGroup,
  item:TRaceFeatureGroup,
  part:string
) => {

  const group:Partial<TRaceFeatureGroup> = {
    items: { ...existing.items, ...item.items }
  }

  // Check if it's a folder, and in editing mode
  // Ensure editing is set directly on the featureGroup object
  // Editing mode is reused for both a new group, and existing with `editing` property set
  if(part === EmptyFeatureGroupUUID || item.editing || (!exists(item.editing) && existing.editing))
    group.editing = true

  return group
}

const addItemToGroup = (
  groups:TRaceFeatureGroup,
  item:TRaceFeatureItem,
  part:string,
  loc:string,
) => {
  const existing = groups.items[loc] || emptyObj

  groups.items[loc] = {
    ...existing,
    ...item,
    ...(
      // Only groups has items, so check and add group props when needed
      (`items` in existing)
        ? addGroupProps(existing, item as TRaceFeatureGroup, part)
        : emptyObj
      )
  }

  return groups
}
 
export const createFromPath = (
  groups:TRaceFeatureGroup,
  item:TRaceFeatureItem,
  parts:string[],
  fullLoc:string,
  relative:string
):TRaceFeatureGroup => {

  const part = parts.shift()
  if(!part) return groups

  const loc = `/${part}`
  fullLoc = `${fullLoc.replace(/\/$/, ``)}${loc}`
  relative = `${relative.replace(/\/$/, ``)}/${loc}`

  // If it's the last part of the path,
  // Then this is where the item should be added
  // The addItemToGroup, with merge the item, with any existing item in groups
  // item takes precedence over an existing item in the groups object
  if(!parts.length)
    return addItemToGroup(
      groups,
      item,
      part,
      loc,
    )

  // Check for an existing item at the path
  // And if it exists, then use it as the parent Groups object
  const found = groups.items[loc] as TRaceFeatureGroup
  if(found){
    groups.items[loc] = createFromPath(
      found,
      item,
      parts,
      fullLoc,
      relative,
    )

    return groups
  }

  // If no existing item, then build it
  // This happens when a feature is built before it's parent folder / group
  // This will recreate an existing folder
  // But duplicate folder should be merged when the folder is built
  // From the found check in the code above
  const built = groupFactory({
    fullLoc,
    title: part,
    path: relative,
  })

  // Use the newly built group as the parent group moving forward
  groups.items[loc] = createFromPath(
    built,
    item,
    parts,
    fullLoc,
    relative,
  )

  return groups
}
