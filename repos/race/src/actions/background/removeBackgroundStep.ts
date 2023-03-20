import { logNotFound, missingId } from '@GBR/utils/logging'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'

const prefix = `[Remove Background#Step]`

export const removeBackgroundStep = async (stepId:string) => {
  if(!stepId) return missingId(`step`, prefix)

  const { feature } = await getFeature()
  if(!feature) return logNotFound(`feature`, prefix)

  if(!feature.background) return logNotFound(`background`, prefix)

  updateFeature({
    ...feature,
    background: {
      ...feature.background,
      steps: feature.background.steps.filter(step => step.uuid !== stepId)
    }
  })

}