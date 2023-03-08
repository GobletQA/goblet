import type { TFeatureAction } from './FeatureAction'

import { FeatureActionsContainer } from './Feature.styled'

import { FeatureAction } from './FeatureAction'

export type TFeatureHeaderActions = {
  items:TFeatureAction[]
}

export const FeatureHeaderActions = (props:TFeatureHeaderActions) => {
  const {
    items
  } = props

  return (
    <FeatureActionsContainer className='feature-actions-container' >
      {items.map(item => {
        return (
          <FeatureAction {...item} />
        )
      })}
    </FeatureActionsContainer>
  )
}