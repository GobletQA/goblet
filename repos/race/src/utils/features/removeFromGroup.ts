import type { TRaceFeatures, TRaceFeatureGroup } from '@GBR/types'


export const removeFromGroup = (
  featureGroups:TRaceFeatureGroup,
  uuid:string
) => {
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
          ? removeFromGroup(item, uuid)
          : item
        : undefined

      add ? (acc[key] = add) : (found = true)

      return acc
    }, {} as TRaceFeatures)

  return featureGroups
}
