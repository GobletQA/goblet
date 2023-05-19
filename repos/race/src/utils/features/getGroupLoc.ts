import type { TRaceFeatureGroup } from '@GBR/types'

import { cleanString } from '@GBR/utils/helpers/cleanString'

export const getGroupLoc = (
  parentGroup:Partial<TRaceFeatureGroup>,
  featureGroup:TRaceFeatureGroup,
  loc:string=``
) => {

  let found = false
  Object.entries(parentGroup?.items || {})
    .forEach(([key, item]) => {

      if(!(`items` in item) || found) return
      else if(item.uuid !== featureGroup.uuid)
        return (loc = getGroupLoc(item, featureGroup, loc))

      found = true
      loc = `${loc}${parentGroup.path}/${cleanString(featureGroup.title)}`
    })

  return loc
}