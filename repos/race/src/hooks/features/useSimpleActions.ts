import type {
  TAnyCB,
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
    () => {
      const scn = scenario || ensureScenario(parent)
      addSimpleModeStep({scenario: scn, feature: parent})
    },
    [parent, scenario?.uuid]
  )

  const hasPasteStep = operations?.paste && (operations?.paste as TRaceStep)?.step
  const onSimplePaste =  useInline(() => {
    hasPasteStep
      && pasteSimpleModeStep({
          parent,
          step: operations?.paste as TRaceStep,
          scenario: scenario || ensureScenario(parent),
        })
  })

  return {
    onSimpleAdd,
    onSimplePaste: hasPasteStep ? onSimplePaste : undefined,
  }

}
