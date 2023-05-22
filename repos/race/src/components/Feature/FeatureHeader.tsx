import type { TRaceFeature } from '@GBR/types'
import type { TFeatureItem } from './FeatureItems'

import { PurpleText } from '@gobletqa/components'
import { DecoText } from '@GBR/components/Deco/DecoText'
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
      <DecoText id={feature.uuid} >
        <HeaderText>
          <PurpleText>Feature:</PurpleText> {feature.feature || ``}
        </HeaderText>
      </DecoText>
      <FeatureHeaderActions feature={feature} items={items} />
    </FeatureHeaderContainer>
  )

}