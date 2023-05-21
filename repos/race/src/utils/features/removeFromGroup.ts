import type { TTabItem } from '@gobletqa/components'
import type { TRaceFeatures, TRaceFeatureGroup } from '@GBR/types'

export type TRemoveFromGroup = {
  uuid:string,
  tabs:TTabItem[]
  featureGroups:TRaceFeatureGroup,
}

export const removeFromGroup = ({
  tabs,
  uuid,
  featureGroups,
}:TRemoveFromGroup) => {
  if(!uuid){
    console.warn(`[Remove Feature Group] Missing feature group item uuid`)
    return featureGroups
  }

  const groups = featureGroups?.items || {}

  let found = false
  featureGroups.items = Object.entries(groups)
    .reduce((acc, [key, item]) => {

      if(found){
        acc[key] = item
        return acc
      }

      let add = item.uuid !== uuid
        ? `items` in item
          ? removeFromGroup({ featureGroups: item, uuid, tabs})
          : item
        : undefined

      add ? (acc[key] = add) : (found = true)

      return acc
    }, {} as TRaceFeatures)

  return featureGroups
}
