import type { TRaceFeature, TFeaturesRef } from '@GBR/types'

import { useCallback } from 'react'
import { useFeature } from '../../contexts'
import {
  Features,
  FeatureText,
  FeatureItem,
} from './FeaturesList.styled'

export type TFeaturesList = {
  featuresRef:TFeaturesRef
}

type TListItem = {
  feature:TRaceFeature
}

const ListItem = (props:TListItem) => {
  const { feature:active, setFeature } = useFeature()

  const { feature } = props

  const onClick = useCallback(() => setFeature(feature), [feature, setFeature])

  return (
    <FeatureItem
      onClick={onClick}
    >
      <FeatureText>
        {feature.feature}
      </FeatureText>
    </FeatureItem>
  )
}

export const FeaturesList = (props:TFeaturesList) => {
  const {
    featuresRef
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
          />
        )
      })}
    </Features>
  )

}