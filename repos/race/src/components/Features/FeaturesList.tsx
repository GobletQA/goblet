import type { TRaceFeature, TFeaturesRef } from '@GBR/types'
import type { TTabAction } from '../../goblet'

import { useCallback } from 'react'
import { useFeature } from '../../contexts'
import {
  Features,
  FeatureText,
  FeatureItem,
} from './FeaturesList.styled'

export type TFeaturesList = {
  featuresRef:TFeaturesRef
  onActiveFeature: TTabAction
}

type TListItem = {
  feature:TRaceFeature
  onActiveFeature: TTabAction
}

const ListItem = (props:TListItem) => {
  const { feature:active, setFeature } = useFeature()

  const { feature, onActiveFeature } = props

  const onClick = useCallback(() => onActiveFeature(feature), [feature, onActiveFeature])

  return (
    <FeatureItem onClick={onClick} >
      <FeatureText>
        {feature.feature}
      </FeatureText>
    </FeatureItem>
  )
}

export const FeaturesList = (props:TFeaturesList) => {
  const {
    featuresRef,
    onActiveFeature
  } = props

  return (
    <Features
      component='nav'
      className='goblet-race-features-list'
      aria-labelledby='nested-list-subheader'
    >
      {Object.entries(featuresRef.current).map(([key, feature]) => {
        return (
          <ListItem
            feature={feature}
            key={`${key}-${feature.uuid}`}
            onActiveFeature={onActiveFeature}
          />
        )
      })}
    </Features>
  )

}