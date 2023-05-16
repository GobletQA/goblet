import type {
  TFeatureCB,
  TRaceFeature,
  TOnFeatureCB,
  TFeaturesRef,
  TSetFeatureOpts,
  TSetFeatureRefs,
} from '@GBR/types'

import { SetFeatureContextEvt } from '@GBR/constants'
import { EmptyFeatureUUID } from '@GBR/constants/values'
import { useOnEvent, useInline } from '@gobletqa/components'


export type THEmptyFeatureCallbacks = {
  featuresRef:TFeaturesRef
  updateEmptyTab:TFeatureCB
  setFeatureRefs:TSetFeatureRefs
  setFeature:(feat?: TRaceFeature | undefined, opts?:TSetFeatureOpts) => void
}

export const useEmptyFeature = (props:THEmptyFeatureCallbacks) => {

  const {
    setFeature,
    featuresRef,
    updateEmptyTab,
    setFeatureRefs,
  } = props

  const setEmptyFeature = useInline(((feat:TRaceFeature) => {
    if(feat?.uuid === EmptyFeatureUUID){
      setFeatureRefs({ ...featuresRef.current, [EmptyFeatureUUID]: feat })
      updateEmptyTab?.(feat)
    }

    setFeature(feat, { checkInactive: false })
  }) as TOnFeatureCB)


  useOnEvent<TRaceFeature>(
    SetFeatureContextEvt,
    setEmptyFeature
  )

}