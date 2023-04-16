import type { TRaceFeature } from '@GBR/types/features.types'
import type { TMatchExpRes } from '@GBR/types/expressions.types'

export type TAuditOpts = {
  skipAudit?:boolean
  mergeAudit?:boolean
  removeAuditSteps?:boolean
}

export type TOnAuditFeatureCB = (feature: TRaceFeature, opts?:TAuditOpts) => void

export type TAuditFeature = {
  feature:TRaceFeature
}

export type TAudit = {
  [key:string]: TMatchExpRes
}
