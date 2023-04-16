import type { TStepDef } from '@ltipton/parkin'
import type { TExpPart, TRaceStep } from '@GBR/types'

import { useMemo } from 'react'
import { useEditor, useStepDefs } from '@GBR/contexts'

export type THStepAudit = {
  step:TRaceStep
}

export type THStepAuditRes = {
  step:TRaceStep
  def?:TStepDef
  expressions?:TExpPart[]
}

export const useStepAudit = (props:THStepAudit):THStepAuditRes => {
  const { step } = props
  const { audit } = useEditor()
  const { defs } = useStepDefs()

  return useMemo(() => {
    const stepAudit = audit[step?.uuid]
    return !stepAudit
      ? { step }
      : {
          step,
          def: defs[stepAudit?.def?.uuid],
          expressions: audit[step?.uuid]?.expressions,
        }
  }, [
    defs,
    step?.uuid,
    step?.definition,
    audit[step?.uuid],
  ])
}