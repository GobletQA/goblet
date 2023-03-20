import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { backgroundFactory } from '@GBR/factories/backgroundFactory'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'

export const addBackground = async () => {
  const { feature } = await getFeature()
  if(!feature) return

  const background = backgroundFactory({feature, empty: true })
  if(!background)
    return console.warn(`Failed to add background to feature. Background factory failed to build background`)
  
  updateFeature({...feature, background})
}