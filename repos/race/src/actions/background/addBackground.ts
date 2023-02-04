import { backgroundFactory } from '@GBR/factories/backgroundFactory'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'

export const addBackground = async () => {
  const feature = await getFeature()
  if(!feature) return

  const background = backgroundFactory(undefined, true)
  updateFeature({...feature, background})
}