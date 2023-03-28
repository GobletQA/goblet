import type { TRaceFeature } from '@GBR/types'
import type { TFeatureAction } from './FeatureAction'

import { FeatureActionsContainer } from './Feature.styled'

import { FeatureAction } from './FeatureAction'

export type TFeatureHeaderActions = {
  feature:TRaceFeature
  items:TFeatureAction[]
}

export const FeatureHeaderActions = (props:TFeatureHeaderActions) => {
  const {
    items,
    feature,
  } = props

  return (
    <FeatureActionsContainer className='feature-actions-container' >
      {items.map(item => {
        return (
          <FeatureAction {...item} feature={feature} />
        )
      })}
    </FeatureActionsContainer>
  )
}