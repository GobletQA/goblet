import type { TAuditParkin } from '@GBR/types'
import { ParkinWorker } from '@GBR/workers/parkin/parkinWorker'

export const Environment = process.env.NODE_ENV || `local`
const isLocal = Environment !== `production`

export const featureAudit = async ({ parkin, feature }:TAuditParkin) => {
  let audit
  if(process.env.NODE_ENV !== `production`){
    const mod = await import('@GBR/workers/parkin/audit')
    audit = mod.auditFeature({ parkin, feature })
  }
  else {
    audit = await ParkinWorker.auditFeature({ feature })
  }

  return audit
}