import type { TTabAction } from '@gobletqa/components'
import type {
  TRaceFeature,
  TRaceFeatures,
  TRaceFeatureGroup,
} from '@GBR/types'


import { Features } from './FeaturesList.styled'
import { FeatureItemRender } from './FeatureItemRender'

export type TFeaturesList = {
  active:TRaceFeature
  featureGroups:TRaceFeatures
  onActiveFeature: TTabAction
}

export const FeaturesList = (props:TFeaturesList) => {
  const {
    active,
    featureGroups,
    onActiveFeature
  } = props

  return (
    <Features
      component='nav'
      className='gr-features-list'
      aria-labelledby='nested-list-subheader'
    >
      <FeatureItemRender
        active={active}
        featureGroup={featureGroups}
        onActiveFeature={onActiveFeature}
      />
    </Features>
  )

}