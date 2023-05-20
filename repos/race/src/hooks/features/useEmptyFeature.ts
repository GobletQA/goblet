import type {
  TFeatureCB,
  TRaceFeature,
  TOnFeatureCB,
  TSetFeatureOpts,
  TSetFeatureGroups,
} from '@GBR/types'

import { SetFeatureContextEvt } from '@GBR/constants'
import { EmptyFeatureUUID } from '@GBR/constants/values'
import { useOnEvent, useInline } from '@gobletqa/components'


export type THEmptyFeatureCallbacks = {
  updateEmptyTab:TFeatureCB
  setFeatureGroups:TSetFeatureGroups
  setFeature:(feat?: TRaceFeature | undefined, opts?:TSetFeatureOpts) => void
}

export const useEmptyFeature = (props:THEmptyFeatureCallbacks) => {

  const {
    setFeature,
    updateEmptyTab,
    setFeatureGroups,
  } = props

  const setEmptyFeature = useInline(((feat:TRaceFeature) => {
    if(feat?.uuid === EmptyFeatureUUID){
      setFeatureGroups({ [EmptyFeatureUUID]: feat }, true)
      updateEmptyTab?.(feat)
    }

    setFeature(feat, { checkInactive: false })
  }) as TOnFeatureCB)


  useOnEvent<TRaceFeature>(
    SetFeatureContextEvt,
    setEmptyFeature
  )

}