import type { TRaceBackground, TRaceStep } from '@GBR/types'

import { findStep } from '@GBR/utils/find'
import { logNotFound } from '@GBR/utils/logging'
import { backgroundFactory } from '@GBR/factories/backgroundFactory'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'

const prefix = `[Update Background#Step]`

export const updateBackgroundStep = async (step:TRaceStep) => {
  const { feature } = await getFeature()
  if(!feature) return logNotFound(`feature`, prefix)

  const background = {
    ...(
      feature.background
        || backgroundFactory({feature, empty: true}) as TRaceBackground
    )
  }

  const { step:found, stepIdx, steps } = findStep(background, step.uuid)
  if(!found) return logNotFound(`step`, prefix)

  steps[stepIdx] = step
  updateFeature({...feature, background: {...background, steps}})

}