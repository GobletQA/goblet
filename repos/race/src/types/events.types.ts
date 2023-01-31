import { TRaceFeature } from './features.types'

export type TAnswerFeature = {
  feature:TRaceFeature
  updateFeature: (feat?: Partial<TRaceFeature>) => Promise<void>
}

export type TWithFeatureCB = (data:TAnswerFeature) => void

export type TAskForFeature = {
  cb: TWithFeatureCB
}


