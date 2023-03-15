import type { TRaceStep } from '@GBR/types'

import { useMemo } from 'react'
import { useParkin } from '@GBR/contexts/ParkinContext'

export type THMatchStepToDef = {
  step:TRaceStep
}

export const useMatchStepToDef = (props:THMatchStepToDef) => {
  const { step } = props
  const { parkin } = useParkin()

  return useMemo(() => {
    if(!parkin)  return { step }
    
    const { definition } = parkin?.matcher.search(step.step)

    return {
      definition,
      step: {
        ...step,
        definition: definition?.uuid || undefined
      },
    }
  }, [
    parkin,
    step.step,
    step.definition,
  ])
}