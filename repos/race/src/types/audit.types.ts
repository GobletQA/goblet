import type { TRaceFeature } from '@GBR/types/features.types'
import type { TMatchExpRes } from '@GBR/types/expressions.types'


export type TAuditFeature = {
  feature:TRaceFeature
}

export type TAudit = {
  [key:string]: TMatchExpRes
}
