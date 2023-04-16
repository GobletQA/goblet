import type { TRaceFeature } from '@GBR/types'
import type { MutableRefObject } from 'react'
import type { TWorldConfig, TStepDefsList } from '@ltipton/parkin'

import { useCallback, useState } from 'react'
import { useParkin } from '@GBR/contexts/ParkinContext'
import { useStepDefs } from '@GBR/contexts/StepDefsContext'
import { EditorWorker } from '@GBR/workers/editor/editorWorker'


export type THFeatureAudit = {}


export const useAudit = (props?:THFeatureAudit) => {
  const { world } = useParkin()
  const { defs } = useStepDefs()
  
  const [audit, setAudit] = useState({})
  
  const onAuditFeature = useCallback((feature:TRaceFeature) => {
    
  }, [
    defs,
    world,
    audit
  ])

  return {
    audit,
    setAudit,
    onAuditFeature
  }
}