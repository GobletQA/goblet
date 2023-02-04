import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'

export const removeBackgroundStep = async (stepId:string) => {
  if(!stepId) return console.warn(`Can not remove step; a step id is required`)

  const feature = await getFeature()
  if(!feature) return

  if(!feature.background)
    return console.warn(`Can not remove step; feature.background does not exist.`) 

  updateFeature({
    ...feature,
    background: {
      ...feature.background,
      steps: feature.background.steps.filter(step => step.uuid !== stepId)
    }
  })

}