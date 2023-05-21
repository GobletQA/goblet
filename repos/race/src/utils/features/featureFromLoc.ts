import type { TRaceFeatureItem, TRaceFeatures } from '@GBR/types'

import { get } from '@keg-hub/jsutils'
import { groupFindArr } from './groupFindArr'

export type TFeatureFromLoc = {
  loc:string
  features: TRaceFeatures
}

export const featureFromLoc = ({
  features,
  loc
}:TFeatureFromLoc):TRaceFeatureItem|undefined => get<TRaceFeatureItem>(features, groupFindArr(loc))

export const findGroupItem = (features: TRaceFeatures, loc:string) => featureFromLoc({
  loc,
  features
})