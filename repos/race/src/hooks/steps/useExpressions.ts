import { Parkin, TStepDef } from '@ltipton/parkin'
import type {
  TRaceStep,
  TMatchExpRes,
  TMatchExpReq,
  TRaceStepParent,
} from '@GBR/types'

import { useMemo } from 'react'
import { emptyObj } from '@keg-hub/jsutils'
import { useParkin } from '@GBR/contexts/ParkinContext'
import { useStepDefs }  from '@GBR/contexts/StepDefsContext'
import { stepTokens } from '@GBR/utils/steps/stepTokens'
import { mapStepTokens } from '@GBR/utils/steps/mapStepTokens'
import { getMatchExpressions } from '@GBR/utils/steps/getMatchExpressions'

const emptyExpResp = emptyObj as TMatchExpRes

export type THExpressions = {
  step: TRaceStep
  parent:TRaceStepParent
}

export type TExpOpts = {
  definition?:TStepDef
}


const useMapExpressions = (props:TMatchExpReq) => {
  const {
    def,
    step,
    parkin
  } = props

  /**
   * This hook should only run on step change, **NOT** step input change
   * It's expensive, so try to use only when needed
   */
  const exps = useMemo(() => getMatchExpressions({ def, parkin }), [def])

  /**
   * These hooks should run on every change to step input
   */
  const tokens = useMemo(() => stepTokens({ def, parkin, step: step.step }), [def, step.step])

  /**
   * Maps expressions to Parkin parameters, with parameters overriding expression meta-data
   * They are matched by type, so expression.type **MUST** match parameter.type
   */
  const expressions = useMemo(() => mapStepTokens({ exps, tokens }), [tokens, exps])

  return {
    def,
    expressions
  }
}

export const useExpressions = (props:THExpressions, ext?:TExpOpts) => {
  const { step } = props
  const { defs } = useStepDefs()
  const { parkin } = useParkin()
  if(!parkin) return emptyExpResp
  
  const defId = step?.definition || ext?.definition?.uuid
  const def = (defId && defs[defId]) as TStepDef

  return def
    ? useMapExpressions({ parkin, step, def })
    : emptyExpResp
}
