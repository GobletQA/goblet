import type { TFeatureItem } from './FeatureItems'

import { FeatureMenu } from './FeatureMenu'
import { FeatureHeaderActions } from './FeatureHeaderActions'
import {
  HeaderText,
  FeatureHeaderContainer,
} from './Feature.styled'


export type TFeatureHeader = {
  items:TFeatureItem[]
}

export const FeatureHeader = (props:TFeatureHeader) => {
  const {
    items
  } = props

  return (
    <FeatureHeaderContainer className='feature-header-container' >
      <HeaderText>
        Feature
      </HeaderText>
      <FeatureHeaderActions items={items}/>
    </FeatureHeaderContainer>
  )

}