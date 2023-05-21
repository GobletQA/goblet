import type {
  TFeatureCB,
  TRaceFeature,
  TOnFeatureCB,
  TSetFeatureOpts,
  TSetTabsAndGroups,
  TSetFeatureGroups,
} from '@GBR/types'

import { SetFeatureContextEvt } from '@GBR/constants'
import { EmptyFeatureUUID } from '@GBR/constants/values'
import { useOnEvent, useInline } from '@gobletqa/components'


export type THEmptyFeatureCallbacks = {
  updateEmptyTab:TFeatureCB
  setTabsAndGroups:TSetTabsAndGroups
  setFeatureGroups:TSetFeatureGroups
  setFeature:(feat?: TRaceFeature | undefined, opts?:TSetFeatureOpts) => void
}

export const useEmptyFeature = (props:THEmptyFeatureCallbacks) => {

  const {
    setFeature,
    updateEmptyTab,
    setTabsAndGroups,
  } = props

  const setEmptyFeature = useInline(((feat:TRaceFeature) => {
    if(feat?.uuid === EmptyFeatureUUID){
      setTabsAndGroups({
        merge: true,
        items: { [EmptyFeatureUUID]: feat },
      })
      updateEmptyTab?.(feat)
    }

    setFeature(feat, { checkInactive: false })
  }) as TOnFeatureCB)


  useOnEvent<TRaceFeature>(
    SetFeatureContextEvt,
    setEmptyFeature
  )

}