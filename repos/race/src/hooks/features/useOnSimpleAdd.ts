import type {
  TRaceFeature,
  TRaceScenario,
} from '@GBR/types'

import { useCallback } from 'react'
import { ensureScenario } from '@GBR/utils/features/ensureScenario'
import { addSimpleModeStep } from '@GBR/actions/general/addSimpleModeStep'

export type THOnSimpleAdd = {
  parent:TRaceFeature
  scenario?:TRaceScenario
}

export const useOnSimpleAdd = (props:THOnSimpleAdd) => {
  const { parent, scenario } = props

  return useCallback(
    () => {
      const scn = scenario || ensureScenario(parent)
      addSimpleModeStep({scenario: scn, feature: parent})
    },
    [parent, scenario?.uuid]
  )
}
