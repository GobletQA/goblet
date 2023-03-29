import { Parkin, TStepDef } from '@ltipton/parkin'
import type {
  TExpPart,
  TRaceStep,
  TRaceStepParent,
} from '@GBR/types'

import { useMemo } from 'react'
import { emptyArr, emptyObj } from '@keg-hub/jsutils'
import { useParkin } from '@GBR/contexts/ParkinContext'
import { useStepDefs }  from '@GBR/contexts/StepDefsContext'
import { stepTokens } from '@GBR/utils/steps/stepTokens'
import { mapStepTokens } from '@GBR/utils/steps/mapStepTokens'
import { expressionParts } from '@GBR/utils/steps/expressionParts'
import { matchExpressions } from '@GBR/utils/steps/matchExpressions'

export type THStepSubjects = {
  step: TRaceStep
  parent:TRaceStepParent
}

type ExpResp = {
  def:TStepDef
  expressions:TExpPart[]
}

const useStepParts = (
  parkin:Parkin,
  step:TRaceStep,
  def:TStepDef
) => {
  return useMemo(() => stepTokens(parkin, step.step, def), [def, step.step])
}

const useMatchExpressions = (
  parkin:Parkin,
  def:TStepDef
) => {
  return useMemo(() => {
    const parts = def && expressionParts(parkin, def)

    return def && parts
      ? matchExpressions(def, parts)
      : emptyArr as TExpPart[]
  }, [def])
}

export type TExpOpts = {
  definition?:TStepDef
}

export const useExpressions = (props:THStepSubjects, ext?:TExpOpts) => {
  const { step } = props
  const { defs } = useStepDefs()
  const { parkin } = useParkin()
  if(!parkin) return emptyObj as ExpResp
  
  const defId = step?.definition || ext?.definition?.uuid
  const def = (defId && defs[defId]) as TStepDef

  // Run on every change of step, NOT step input
  const exps = useMatchExpressions(parkin, def)

  // Run on every change to step input
  const tokens = useStepParts(parkin, step, def)
  const expressions = useMemo(() => mapStepTokens(exps, tokens), [tokens, exps])

  return def
    ? { def, expressions }
    : emptyObj as ExpResp
}
