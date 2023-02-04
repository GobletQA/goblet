import type { TRaceFeature } from '@GBR/types'
import { omitKeys } from '@keg-hub/jsutils'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'

export const removeStory = async (parent?:TRaceFeature) => {
  const feature = await getFeature(parent)
  if(!feature) return


  updateFeature(omitKeys<TRaceFeature>(feature, [`perspective`, `reason`, `desire`]))
}