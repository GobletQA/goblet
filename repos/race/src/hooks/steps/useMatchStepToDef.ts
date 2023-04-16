import type { TRaceStep } from '@GBR/types'

import { useMemo } from 'react'
import { useParkin } from '@GBR/contexts/ParkinContext'
import { matchStepToDef } from '@GBR/utils/steps/matchStepToDef'

export type THMatchStepToDef = {
  step:TRaceStep
}

export const useMatchStepToDef = (props:THMatchStepToDef) => {
  const { step } = props
  const { parkin } = useParkin()

  return useMemo(() => {
    return parkin ? matchStepToDef({ step, parkin }) : { step }
  }, [
    parkin,
    step.step,
    step.definition,
  ])
}