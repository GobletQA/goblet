import type { TRaceFeatures, TRaceFeatureGroup } from '@GBR/types'


export const removeGroup = (
  featureGroups:TRaceFeatureGroup,
  uuid:string
) => {
  if(!uuid){
    console.warn(`[Remove Feature Group] Missing feature group uuid`)
    return featureGroups
  }

  const groups = featureGroups?.items || {}

  let found = false
  const items = Object.entries(groups)
    .reduce((acc, [key, item]) => {
      if(found) return acc

      let add = item.uuid !== uuid
        ? `items` in item
          ? removeGroup(item, uuid)
          : item
        : undefined

      add ? (acc[key] = add) : (found = true)

      return acc
    }, {} as TRaceFeatures)

  if(found) featureGroups.items = items

  return featureGroups
}
