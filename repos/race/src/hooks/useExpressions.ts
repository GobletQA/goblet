
import type {
  IParkin,
  TExpPart,
  TStepDef,
  TStepAst,
  TStepParentAst,
} from '@GBR/types'


import { useMemo } from 'react'
import { emptyArr, emptyObj } from '@keg-hub/jsutils'
import { useStepDefs }  from '@GBR/contexts/StepDefsContext'
import { useParkin } from '@GBR/contexts/ParkinContext'
import { matchStepParts } from '@GBR/utils/steps/matchStepParts'
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

const useStepParts = (parkin:IParkin, step:TStepAst, def:TStepDef) => {
  return useMemo(() => {
    return def ? matchStepParts(parkin, step.step, def) : emptyObj
  }, [def, step.step])
}

const useMatchExpressions = (parkin:IParkin, def:TStepDef) => {
  return useMemo(() => {
    const parts = def?.meta?.expressions?.length
      ? parkin.matcher.parts(def.match as string)
      : []

    return def
      ? matchExpressions(def, parts)
      : emptyArr as TExpPart[]
  }, [def])
}

export const useExpressions = (props:THStepSubjects) => {
  const { step } = props
  const { defs } = useStepDefs()
  const { parkin } = useParkin()
  const def = (step?.definition && defs[step?.definition]) as TStepDef

  // Run on every change of step, NOT step input
  const expressions = useMatchExpressions(parkin, def)

  // Run on every change to step input
  const meta = useStepParts(parkin, step, def)

  // TODO - figure out how to parse the values from the current step.step ???

  return def
    ? { def, expressions }
    : emptyObj as ExpResp
}
