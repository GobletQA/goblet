import type { TStepAst } from '@ltipton/parkin'


import { useMemo } from 'react'
import { useParkin } from '@GBR/contexts/ParkinContext'


export type THMatchStepToDef = {
  step:TStepAst
}

export const useMatchStepToDef = (props:THMatchStepToDef) => {
  const { step } = props
  const { parkin } = useParkin()

  return useMemo(() => {
    const { definition } = parkin.matcher.find(step.step)

    return {
      definition,
      step: {
        ...step,
        definition: definition?.uuid || undefined
      },
    }
  }, [
    step.step,
    step.definition,
  ])
}