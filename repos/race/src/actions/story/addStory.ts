import { deepMerge } from '@keg-hub/jsutils'
import { storyFactory } from '@GBR/factories/storyFactory'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'

export const addStory = async () => {
  const { feature } = await getFeature()
  if(!feature) console.warn(`Can not access feature context from 'addStory' action.`) 

  const story = storyFactory(undefined, true)
  const featWStory = deepMerge(story, feature)

  updateFeature(featWStory)
}