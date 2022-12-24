import type { TRaceFeature, TFeaturesRef } from '@GBR/types'

import Box from '@mui/material/Box'
import { useCallback } from 'react'
import { useFeature } from '../../contexts'
import { ListFeatures, FeaturesItem } from './FeaturesList.styled'

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
    <FeaturesItem
      onClick={onClick}
    >
      <Box>
        {feature.feature}
      </Box>
    </FeaturesItem>
  )
}

export const FeaturesList = (props:TFeaturesList) => {
  const {
    featuresRef
  } = props

  return (
    <ListFeatures
      className='goblet-race-features-list'
      subheader={<li />}
    >
      {Object.entries(featuresRef.current).map(([key, feature]) => {
        return (
          <ListItem
            feature={feature}
            key={`${key}-${feature.uuid}`}
          />
        )
      })}
    </ListFeatures>
  )

}