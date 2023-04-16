import type { TRaceFeature } from '@GBR/types'
import { useCallback, useState } from 'react'
import { useParkin } from '@GBR/contexts/ParkinContext'
import { useStepDefs } from '@GBR/contexts/StepDefsContext'
import { ParkinWorker } from '@GBR/workers/parkin/parkinWorker'


export type THFeatureAudit = {}


export const useAudit = (props?:THFeatureAudit) => {
  const { world } = useParkin()
  const { defs } = useStepDefs()
  
  const [audit, setAudit] = useState({})
  
  const onAuditFeature = useCallback((feature:TRaceFeature) => {
    ParkinWorker.auditFeature({
      defs,
      world,
      feature,
    })
  }, [
    defs,
    audit,
    world,
  ])

  return {
    audit,
    setAudit,
    onAuditFeature
  }
}