import type { TAuditParkin } from '@GBR/types'
import { ParkinWorker } from '@GBR/workers/parkin/parkinWorker'

export const Environment = process.env.NODE_ENV || `local`
const isLocal = Environment === `local`

export const featureAudit = async () => {
  const mod = isLocal
    ? await import('@GBR/workers/parkin/audit')
    : ParkinWorker
  
  return async ({ parkin, feature }:TAuditParkin) => {
    return isLocal
      ? mod.auditFeature({ parkin, feature })
      : ParkinWorker.auditFeature({ feature })
  }
}