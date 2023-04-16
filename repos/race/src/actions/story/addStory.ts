import { storyFactory } from '@GBR/factories/storyFactory'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'

export const addStory = async () => {
  const { feature } = await getFeature()
  if(!feature) return

  const story = storyFactory({ feature, empty: true })

  // TODO: add expand for story section ?? { expand: story.uuid }
  updateFeature({...feature, ...story}, { skipAudit: true })

}