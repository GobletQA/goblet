import type {
  TAudit,
  TRaceFeature,
  TOnParkinInit,
  TOnAuditFeatureCB,
} from '@GBR/types'

import { emptyObj, pickKeys } from '@keg-hub/jsutils'
import { useCallback, useState } from 'react'
import { useOnEvent } from '@gobletqa/components'
import { ParkinInitEvt } from '@GBR/constants/events'
import { ParkinWorker } from '@GBR/workers/parkin/parkinWorker'

const emptyAudit = emptyObj as TAudit

export type THFeatureAudit = {
  feature?: TRaceFeature
}

export const useAudit = (props:THFeatureAudit) => {
  const { feature } = props
  const [audit, setAudit] = useState(emptyAudit)

  const onAuditFeature = useCallback<TOnAuditFeatureCB>(async (feature, opts=emptyObj) => {
    const {
      skipAudit,
      mergeAudit,
      removeAuditSteps
    } = opts

    if(skipAudit) return

    const updated = await ParkinWorker.auditFeature({ feature }) || emptyAudit

    if(mergeAudit) return setAudit({ ...audit, ...updated })
    if(removeAuditSteps) return setAudit(pickKeys(audit, Object.keys(updated)))

    setAudit(updated)
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