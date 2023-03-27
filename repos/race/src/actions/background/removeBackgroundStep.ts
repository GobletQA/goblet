import { emptyArr } from '@keg-hub/jsutils'
import { findBackground } from '@GBR/utils/find'
import { logNotFound, missingId } from '@GBR/utils/logging'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'

const prefix = `[Remove Background#Step]`

export const removeBackgroundStep = async (stepId:string, backgroundId:string) => {
  if(!stepId) return missingId(`step`, prefix)

  const { feature } = await getFeature()
  if(!feature) return logNotFound(`feature`, prefix)

  const { background, rule, index, } = findBackground(backgroundId, feature)
  if(!background) return logNotFound(`background`, prefix)

  if(!rule || !index)
    return updateFeature({
      ...feature,
      background: {
        ...background,
        steps: background.steps.filter(step => step.uuid !== stepId)
      }
    })

  const rules = [...(feature?.rules || emptyArr)]
  rules[index] = {
    ...rule,
    background: {
      ...background,
      steps: background.steps.filter(step => step.uuid !== stepId)
    }
  }

  updateFeature({...feature, rules})
}