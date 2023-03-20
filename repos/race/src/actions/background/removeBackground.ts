import { omitKeys } from '@keg-hub/jsutils'
import { logNotFound } from '@GBR/utils/logging'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'

export const removeBackground = async () => {
  const { feature } = await getFeature()
  if(!feature) return logNotFound(`feature`, `[Remove Background]`)

  updateFeature(omitKeys(feature, [`background`]))
}