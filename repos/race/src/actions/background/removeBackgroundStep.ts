import type { TRaceFeature, TRaceBackgroundParent } from '@GBR/types'

import { emptyArr } from '@keg-hub/jsutils'
import { findBackground } from '@GBR/utils/find'
import { logNotFound, missingId } from '@GBR/utils/logging'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'

const prefix = `[Remove Background#Step]`

export const removeBackgroundStep = async (
  stepId:string,
  backgroundId:string,
  parent?:TRaceBackgroundParent,
  parentFeat?:TRaceFeature
) => {
  if(!stepId) return missingId(`step`, prefix)

  const { feature } = await getFeature(parentFeat)
  if(!feature) return logNotFound(`feature`, prefix)

  const { background, rule, ruleIdx:index, } = findBackground(feature, backgroundId, parent)
  if(!background) return logNotFound(`background`, prefix)

  if(!rule || !index){
    const updated = {
      ...feature,
      background: {
        ...background,
        steps: background.steps.filter(step => step.uuid !== stepId)
      }
    }
    !parentFeat && updateFeature(updated)

    return updated
  }

  const rules = [...(feature?.rules || emptyArr)]
  rules[index] = {
    ...rule,
    background: {
      ...background,
      steps: background.steps.filter(step => step.uuid !== stepId)
    }
  }

  const updated = {...feature, rules}
  !parentFeat && updateFeature(updated)

  return updated
}