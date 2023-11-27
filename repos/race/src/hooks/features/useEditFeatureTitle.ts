import type { ChangeEvent } from 'react'
import type { TChangeCB, TInputValue } from '@gobletqa/components'
import type {
  TRaceFeature,
  TUpdateFeatureOpts
} from '@GBR/types'


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

  return useCallback<TChangeCB>(async (evt:ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, value?:TInputValue) => {
    const text = (value || evt.target.value) as string

    const opts = uuid === EmptyFeatureUUID ? { create: true } : emptyObj

    const updated = !featureIsEmpty(parent)
      ? { ...parent, feature: text }
      : await featureFactory({...parent, feature: text}, true)

    text && updateFeature(updated, opts as TUpdateFeatureOpts)
  }, [parent, feature, uuid])

}
