import type { TRaceFeature } from '@GBR/types'

import { deepMerge } from '@keg-hub/jsutils'
import { backgroundFactory } from '@GBR/factories/backgroundFactory'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'

export const addBackground = async () => {
  const { feature } = await getFeature()
  if(!feature) console.warn(`Can not access feature context from 'addStory' action.`) 

  const background = backgroundFactory(undefined, true)
  updateFeature({...feature, background})
}