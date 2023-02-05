
import type {
  IParkin,
  TExpPart,
  TStepDef,
  TStepAst,
  TMatchTokens,
  TStepParentAst,
} from '@GBR/types'

import { useMemo } from 'react'
import { emptyArr, emptyObj } from '@keg-hub/jsutils'
import { useStepDefs }  from '@GBR/contexts/StepDefsContext'
import { useParkin } from '@GBR/contexts/ParkinContext'

import { stepTokens } from '@GBR/utils/steps/stepTokens'
import { mapStepTokens } from '@GBR/utils/steps/mapStepTokens'
import { expressionParts } from '@GBR/utils/steps/expressionParts'
import { matchExpressions } from '@GBR/utils/steps/matchExpressions'

export type THStepSubjects = {
  step: TStepAst
  parent:TStepParentAst
  onChange?:(updated:TStepAst, old?:TStepAst) => void
}

type ExpResp = {
  def:TStepDef
  expressions:TExpPart[]
}

const useStepParts = (
  parkin:IParkin,
  step:TStepAst,
  def:TStepDef
) => {
  return useMemo(() => stepTokens(parkin, step.step, def), [def, step.step])
}

const useMatchExpressions = (parkin:IParkin, def:TStepDef) => {
  return useMemo(() => {
    const parts = def && expressionParts(parkin, def)

    return def && parts
      ? matchExpressions(def, parts)
      : emptyArr as TExpPart[]
  }, [def])
}

const useTokenMap = (
  exps:TExpPart[],
  tokens:TMatchTokens[]
) => {
  return useMemo(() => mapStepTokens(exps, tokens), [tokens, exps])
}

export const useExpressions = (props:THStepSubjects) => {
  const { step } = props
  const { defs } = useStepDefs()
  const { parkin } = useParkin()
  const def = (step?.definition && defs[step?.definition]) as TStepDef

  // Run on every change of step, NOT step input
  const exps = useMatchExpressions(parkin, def)

  // Run on every change to step input
  const tokens = useStepParts(parkin, step, def)
  const expressions = useTokenMap(exps, tokens)

  return def
    ? { def, expressions }
    : emptyObj as ExpResp
}
