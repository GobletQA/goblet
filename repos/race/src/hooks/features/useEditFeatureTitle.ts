import type { ChangeEvent } from 'react'
import type { TRaceFeature } from '@GBR/types'
import type { TChangeCB } from '@gobletqa/components'


import { useCallback } from 'react'
import { emptyObj } from '@keg-hub/jsutils'
import { updateFeature } from '@GBR/actions/feature/updateFeature'

export type THEditFeatureTitle = {
  parent:TRaceFeature
}

export const useEditFeatureTitle = ({ parent }:THEditFeatureTitle) => {
  const { feature } = (parent || emptyObj)
  
  return useCallback(((evt:ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, value:string) => {
    updateFeature({ ...parent, feature: value || evt.target.value }, { create: true })
  }) as TChangeCB, [parent, feature])
  
}