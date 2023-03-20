import type { TRaceBackground } from '@GBR/types'

import { deepMerge } from '@keg-hub/jsutils'
import { logNotFound } from '@GBR/utils/logging'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'

const prefix = `[Update Background]`

export const updateBackground = async (update:Partial<TRaceBackground>) => {
  const { feature } = await getFeature()
  if(!feature) return logNotFound(`feature`, prefix)

  // TODO: parkin is not parsing the background title content
  // It gets replace with some content from the parent, need to update parkin
  updateFeature({...feature, background: deepMerge(feature?.background, update)})
}