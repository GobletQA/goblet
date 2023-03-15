import type { TRaceBackground, TRaceStep } from '@GBR/types'

import { findStep } from '@GBR/utils/find'
import { backgroundFactory } from '@GBR/factories/backgroundFactory'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'

export const updateBackgroundStep = async (step:TRaceStep) => {
  const feature = await getFeature()
  if(!feature) return

  const background = {
    ...(
      feature.background
        || backgroundFactory({empty: true}) as TRaceBackground
    )
  }

  const { step:found, stepIdx, steps } = findStep(background, step.uuid)
  if(!found) return

  steps[stepIdx] = step
  updateFeature({...feature, background: {...background, steps}})

}