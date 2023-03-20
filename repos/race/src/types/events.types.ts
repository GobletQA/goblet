import type { TIndexAst } from '@ltipton/parkin'
import type { TRaceFeature } from './features.types'

export type TAnswerFeature = {
  indexes:TIndexAst
  feature:TRaceFeature
}

export type TWithFeatureCB = (data:TAnswerFeature) => void

export type TAskForFeature = {
  cb: TWithFeatureCB
}
