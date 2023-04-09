import type { TRaceFeature } from '@GBR/types'
import type { TFeatureItem } from './FeatureItems'

import { FeatureMenu } from './FeatureMenu'
import { FeatureMenuContainer } from './Feature.styled'

export type TFeatureHeaderActions = {
  feature:TRaceFeature
  items:TFeatureItem[]
}

export const FeatureHeaderActions = (props:TFeatureHeaderActions) => {
  const {
    items,
    feature,
  } = props

  return (
    <FeatureMenuContainer className='gb-feature-menu-container' >
      <FeatureMenu
        items={items}
        feature={feature}
      />
    </FeatureMenuContainer>
  )
}