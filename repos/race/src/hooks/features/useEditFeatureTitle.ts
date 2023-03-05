import type { TRaceFeature } from '@GBR/types'
import type { ChangeEvent } from 'react'
import type { TChangeCB } from '@gobletqa/components'

import { useCallback } from 'react'
import { updateFeature } from '@GBR/actions/feature/updateFeature'

export type THEditFeatureTitle = {
  parent:TRaceFeature
}

export const useEditFeatureTitle = ({ parent }:THEditFeatureTitle) => {
  const { feature, uuid } = parent
  
  return useCallback(((evt:ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, value:string) => {
    updateFeature({ ...parent, feature: value || evt.target.value })
  }) as TChangeCB, [parent, feature])
  
}