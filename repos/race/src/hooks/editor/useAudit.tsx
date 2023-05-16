import type {
  TAudit,
  TAuditParkin,
  TRaceFeature,
  TOnParkinInit,
  TOnAuditFeatureCB,
} from '@GBR/types'

import { useCallback, useState } from 'react'
import { useOnEvent } from '@gobletqa/components'
import { ParkinInitEvt } from '@GBR/constants/events'
import { emptyObj, pickKeys } from '@keg-hub/jsutils'
import { ParkinWorker } from '@GBR/workers/parkin/parkinWorker'
import { featureIsEmpty } from '@GBR/utils/features/featureIsEmpty'

const emptyAudit = emptyObj as TAudit

export type THFeatureAudit = {
  feature?: TRaceFeature
}

export const useAudit = (props:THFeatureAudit) => {
  const { feature } = props
  const [audit, setAudit] = useState(emptyAudit)

  const onAuditFeature = useCallback<TOnAuditFeatureCB>(async (feat, opts=emptyObj) => {
    const {
      skipAudit,
      mergeAudit,
      removeAuditSteps
    } = opts

    if(skipAudit) return

    // Easier to debug when not running through a worker
    const updated = await ParkinWorker.auditFeature({ feature: feat })

    if(mergeAudit) return setAudit({ ...audit, ...updated })
    if(removeAuditSteps) return setAudit(pickKeys(audit, Object.keys(updated)))

    setAudit(updated || emptyAudit)
  }, [audit])

  /**
   * Listen for parkin to be initialized, Then audit the feature
   * Otherwise we don't have access to the definitions
   */
  useOnEvent<TOnParkinInit>(ParkinInitEvt, () => {
    feature
      && !featureIsEmpty(feature)
      && audit === emptyAudit
      && onAuditFeature(feature)
  })

  return {
    audit,
    feature,
    setAudit,
    onAuditFeature,
    featureIsEmpty,
  }
}