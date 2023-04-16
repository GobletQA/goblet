import type { TOnParkinInit, TAudit, TRaceFeature } from '@GBR/types'

import { emptyObj } from '@keg-hub/jsutils'
import { useCallback, useState } from 'react'
import { useOnEvent } from '@gobletqa/components'
import { ParkinInitEvt } from '@GBR/constants/events'
import { useParkin } from '@GBR/contexts/ParkinContext'
import { useStepDefs } from '@GBR/contexts/StepDefsContext'
import { ParkinWorker } from '@GBR/workers/parkin/parkinWorker'


const emptyAudit = emptyObj as TAudit

export type THFeatureAudit = {
  feature?: TRaceFeature
}

export const useAudit = (props:THFeatureAudit) => {
  const { feature } = props
  const { world } = useParkin()
  const { defs } = useStepDefs()
  
  const [audit, setAudit] = useState(emptyAudit)
  
  const onAuditFeature = useCallback(async (feature:TRaceFeature) => {
    const audit = await ParkinWorker.auditFeature({ feature })
    audit && setAudit(audit)
  }, [ audit ])

  /**
   * Listen for parkin to be initialized, Then audit the feature
   * Otherwise we don't have access to the definitions
   */
  useOnEvent<TOnParkinInit>(ParkinInitEvt, () => {
    feature
      && audit === emptyAudit
      && onAuditFeature(feature)
  })

  return {
    audit,
    setAudit,
    onAuditFeature
  }
}