import { TRaceFeature, TRaceIndex } from './features.types'

export type TAnswerFeature = {
  indexes:TRaceIndex
  feature:TRaceFeature
}

export type TWithFeatureCB = (data:TAnswerFeature) => void

export type TAskForFeature = {
  cb: TWithFeatureCB
}
