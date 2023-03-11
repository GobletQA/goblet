import type { TRaceFeature } from '@GBR/types'
import { omitKeys, isArr } from '@keg-hub/jsutils'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'

import { blockFactory, blocksFactory } from '@GBR/factories/blockFactory'

export const updateProperty = async (
  type: `desire`|`perspective`|`reason`,
  content:string|string[]|null,
  parent?:TRaceFeature
) => {
  const feature = await getFeature(parent)
  if(!feature) return
  
  content === null
    ? updateFeature(omitKeys(feature, [type]))
    : updateFeature({
        ...feature,
        [type]: isArr<string[]>(content)
          ? blocksFactory({ blocks: content.map(line => ({ content: line })) })
          : blockFactory({ block: { ...feature[type], content }})
      })
}