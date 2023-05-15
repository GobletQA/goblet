import type { ChangeEvent } from 'react'
import type { TRaceFeature } from '@GBR/types'
import type { TChangeCB } from '@gobletqa/components'


import { useCallback } from 'react'
import { emptyObj } from '@keg-hub/jsutils'
import { EmptyFeatureUUID } from '@GBR/constants'
import { featureFactory } from '@GBR/factories/featureFactory'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { featureIsEmpty } from '@GBR/utils/features/featureIsEmpty'

export type THEditFeatureTitle = {
  parent:TRaceFeature
}

export const useEditFeatureTitle = ({ parent }:THEditFeatureTitle) => {
  const { feature, uuid } = (parent || emptyObj)

  return useCallback(((evt:ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, value:string) => {
    const text = value || evt.target.value

    const opts = uuid === EmptyFeatureUUID
      ? { create: true }
      : emptyObj
      
    const updated = !featureIsEmpty(parent)
      ? { ...parent, feature: text }
      : featureFactory({...parent, feature: text}, true)

    text && updateFeature(updated, opts)
  }) as TChangeCB, [parent, feature, uuid])

}
