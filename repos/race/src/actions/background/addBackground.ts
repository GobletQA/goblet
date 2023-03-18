import { ESectionType } from '@GBR/types'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { backgroundFactory } from '@GBR/factories/backgroundFactory'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'

export const addBackground = async () => {
  const { feature } = await getFeature()
  if(!feature) return

  const background = backgroundFactory({feature, empty: true })
  updateFeature({...feature, background})
}