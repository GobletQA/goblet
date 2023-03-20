import type { TRaceFeature } from './features.types'

export type TAnswerFeature = {
  feature:TRaceFeature
}

export type TWithFeatureCB = (data:TAnswerFeature) => void

export type TAskForFeature = {
  cb: TWithFeatureCB
}
