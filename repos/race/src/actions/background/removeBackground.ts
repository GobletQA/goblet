import { omitKeys } from '@keg-hub/jsutils'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'

export const removeBackground = async () => {
  const feature = await getFeature()
  if(!feature) return

  updateFeature(omitKeys(feature, [`background`]))
}