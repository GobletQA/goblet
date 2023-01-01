import type { TTabAction } from '@gobletqa/components'
import type { TRaceFeature } from '@GBR/types'

import { useCallback } from 'react'
import { cls, wordCaps } from '@keg-hub/jsutils'
import {
  FeatureText,
  FeatureItem,
} from './FeaturesList.styled'

export type TFeatureListItem = {
  active:TRaceFeature
  feature:TRaceFeature
  onActiveFeature: TTabAction
}

export const FeatureListItem = (props:TFeatureListItem) => {
  const { active, feature, onActiveFeature } = props

  const onClick = useCallback(() => onActiveFeature(feature), [feature, onActiveFeature])

  const isActive = feature?.uuid === active?.uuid

  return (
    <FeatureItem
      onClick={onClick}
      className={cls(`gr-features-list-item`, isActive && `active`)}
    >
      <FeatureText>
        {wordCaps(feature.feature)}
      </FeatureText>
    </FeatureItem>
  )
}