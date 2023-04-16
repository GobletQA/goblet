import type { TRaceFeature } from '@GBR/types/features.types'
import type { TWorldConfig, TStepDefsList } from '@ltipton/parkin'

export type TAuditFeature = {
  defs:TStepDefsList
  world:TWorldConfig
  feature:TRaceFeature
}

export type TAudit = {}
