import type {
  TRaceStep,
  TRaceFeature,
  TRaceScenario,
} from '@GBR/types'

import { useCallback } from 'react'
import { useInline } from '@gobletqa/components'
import { useOperations } from '@gobletqa/race/contexts'
import { ensureScenario } from '@GBR/utils/features/ensureScenario'
import { addSimpleModeStep } from '@GBR/actions/general/addSimpleModeStep'
import { pasteSimpleModeStep } from '@GBR/actions/general/pasteSimpleModeStep'

export type THOnSimpleAdd = {
  parent:TRaceFeature
  scenario?:TRaceScenario
}

export const useSimpleActions = (props:THOnSimpleAdd) => {
  const { parent, scenario } = props
  const { operations } = useOperations()

  const onSimpleAdd = useCallback(
    async () => {
      const scn = scenario || ensureScenario(parent)
      scn && addSimpleModeStep({scenario: scn, feature: parent})
    },
    [parent, scenario?.uuid]
  )

  const hasPasteStep = operations?.paste && (operations?.paste?.item as TRaceStep)?.step
  const onSimplePaste =  useInline(async () => {
    const scn = scenario || ensureScenario(parent)
    scn
      && hasPasteStep
      && pasteSimpleModeStep({
          parent,
          scenario: scn,
          from: operations?.paste?.from,
          step: operations?.paste?.item as TRaceStep,
        })
  })

  return {
    onSimpleAdd,
    onSimplePaste: hasPasteStep ? onSimplePaste : undefined,
  }

}
