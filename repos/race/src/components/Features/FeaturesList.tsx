import type { TTabAction } from '@gobletqa/components'
import type { TRaceFeature, TFeaturesRef } from '@GBR/types'

import { useCallback } from 'react'
import { cls } from '@keg-hub/jsutils'
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
  active:TRaceFeature
  feature:TRaceFeature
  onActiveFeature: TTabAction
}

const ListItem = (props:TListItem) => {

  const { active, feature, onActiveFeature } = props

  const onClick = useCallback(() => onActiveFeature(feature), [feature, onActiveFeature])

  const isActive = feature?.uuid === active?.uuid

  return (
    <FeatureItem
      onClick={onClick}
      className={cls(`gr-features-list-item`, isActive && `active`)}
    >
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
  
  const { feature:active, setFeature } = useFeature()

  return (
    <Features
      component='nav'
      className='gr-features-list'
      aria-labelledby='nested-list-subheader'
    >
      {Object.entries(featuresRef.current).map(([key, feature]) => {
        return (
          <ListItem
            active={active}
            feature={feature}
            key={`${key}-${feature.uuid}`}
            onActiveFeature={onActiveFeature}
          />
        )
      })}
    </Features>
  )

}