import type { ChangeEvent } from 'react'
import type { TRaceFeature } from '@GBR/types'
import type { TChangeCB } from '@gobletqa/components'


import { useCallback } from 'react'
import { emptyObj } from '@keg-hub/jsutils'
import { EmptyFeatureUUID } from '@GBR/constants'
import { updateFeature } from '@GBR/actions/feature/updateFeature'

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

    text && updateFeature({ ...parent, feature: text }, opts)
  }) as TChangeCB, [parent, feature, uuid])

}
