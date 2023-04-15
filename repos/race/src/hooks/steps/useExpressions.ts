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
    const filtered = parts && parts.filter((part) => part && part.type !== `optional`)

    return def && filtered
      ? matchExpressions(def, filtered)
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


  /**
   * This hook should only run on step change, **NOT** step input change
   * It's expensive, so try to use only when needed
   */
  const exps = useMatchExpressions(parkin, def)


  /**
   * These hooks should run on every change to step input
   */
  const tokens = useStepParts(parkin, step, def)
  /**
   * Maps expressions to Parkin parameters, with parameters overriding expression meta-data
   * They are matched by type, so expression.type **MUST** match parameter.type
   */
  const expressions = useMemo(() => mapStepTokens(exps, tokens), [tokens, exps])

  return def
    ? { def, expressions }
    : emptyObj as ExpResp
}
