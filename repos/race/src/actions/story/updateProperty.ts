import type { TRaceFeature } from '@GBR/types'
import { omitKeys } from '@keg-hub/jsutils'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'

import { blockFactory } from '@GBR/factories/blockFactory'

export const updateProperty = async (
  type: `desire`|`perspective`|`reason`,
  content:string|null,
  parent?:TRaceFeature
) => {
  const feature = await getFeature(parent)
  if(!feature) return
  
  content === null
    ? updateFeature(omitKeys(feature, [type]))
    : updateFeature({
        ...feature,
        [type]: blockFactory({ ...feature[type], content })
      })
}