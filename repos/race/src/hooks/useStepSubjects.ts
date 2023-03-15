import type { TRaceStep, TRaceStepParent } from '@GBR/types'

import { useMemo } from 'react'
import { useStepDefs }  from '@GBR/contexts/StepDefsContext'
import { matchExpressions } from '@GBR/utils/steps/matchExpressions'

export type THStepSubjects = {
  step: TRaceStep
  parent:TRaceStepParent
  onChange:(step:TRaceStep) => void
}

export const useStepSubjects = (props:THStepSubjects) => {
  const { step } = props
  const { defs } = useStepDefs()
  
  const def = step.definition && defs[step.definition]

  console.log(`------- def -------`)
  console.log(def)
  console.log(`------- step -------`)
  console.log(step)

  return useMemo(() => {
    if(!def) return

    matchExpressions(step, def)

    return []
  }, [step])

  
}