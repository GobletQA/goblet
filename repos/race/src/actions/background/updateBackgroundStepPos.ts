import { missing, logNotFound } from '@GBR/utils/logging'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'

const prefix = `[Update Background Step]`
export const updateBackgroundStepPos = async (
  backgroundId:string,
  oldIdx:number,
  newIdx:number,
) => {
  const { feature } = await getFeature()
  if(!feature) return logNotFound(`feature`, prefix)

  const background = feature.background
  if(!background) return logNotFound(`background`, prefix)

  const moveStep = background.steps[oldIdx]
  if(!moveStep) return missing(`Step. Failed to update step position.`, prefix)

  const steps = [...background.steps]
  steps.splice(oldIdx, 1)
  steps.splice(newIdx, 0, moveStep)

  updateFeature({...feature, background: {...background, steps}})

}