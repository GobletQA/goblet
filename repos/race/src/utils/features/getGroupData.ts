import type { TRaceFeatureGroup } from '@GBR/types'

import { cleanString } from '@GBR/utils/helpers/cleanString'

export type TGroupData = {
  path:string
  title?:string
  relative?:string
}

const getGroupLoc = (
  parentGroup:Partial<TRaceFeatureGroup>,
  featureGroup:TRaceFeatureGroup,
  groupData:TGroupData
) => {

  let found = false
  Object.entries(parentGroup?.items || {})
    .forEach(([key, item]) => {

      if(!(`items` in item) || found) return
      else if(item.uuid !== featureGroup.uuid){
        return getGroupLoc(item, featureGroup, groupData)
      }

      found = true
      groupData.title = cleanString(featureGroup.title)
      groupData.relative = `/${groupData.title}`
      groupData.path = `${groupData.path}${parentGroup.path}/${groupData.title}`
    })

  return groupData
}


export const getGroupData = (
  parentGroup:Partial<TRaceFeatureGroup>,
  featureGroup:TRaceFeatureGroup,
  loc:string=``
) => {
  return getGroupLoc(parentGroup, featureGroup, { path: loc })
}
