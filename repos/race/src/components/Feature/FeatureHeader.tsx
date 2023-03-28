import type { TRaceFeature } from '@GBR/types'
import type { TFeatureItem } from './FeatureItems'

import { FeatureHeaderActions } from './FeatureHeaderActions'
import {
  HeaderText,
  FeatureHeaderContainer,
} from './Feature.styled'


export type TFeatureHeader = {
  feature:TRaceFeature
  items:TFeatureItem[]
}

export const FeatureHeader = (props:TFeatureHeader) => {
  const {
    items,
    feature
  } = props

  return (
    <FeatureHeaderContainer className='feature-header-container' >
      <HeaderText>
        Feature: {feature.feature || ``}
      </HeaderText>
      <FeatureHeaderActions feature={feature} items={items} />
    </FeatureHeaderContainer>
  )

}