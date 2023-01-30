import { backgroundFactory } from '@GBR/factories/backgroundFactory'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'

export const addBackgroundStep = async () => {
  const { feature } = await getFeature()
  if(!feature) console.warn(`Can not access feature context from 'addStory' action.`) 

  console.log(`------- addBackgroundStep -------`)
  // const background = backgroundFactory(undefined, true)
  // updateFeature({...feature, background}, true)
}