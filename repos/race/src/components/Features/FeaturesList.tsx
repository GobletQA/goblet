import type { TTabAction } from '@gobletqa/components'
import type {
  TRaceFeature,
  TRaceFeatures,
  TEditorFeatureActions,
} from '@GBR/types'


import { Features } from './FeaturesList.styled'
import { FeatureItemRender } from './FeatureItemRender'

export type TFeaturesList = TEditorFeatureActions & {
  active:TRaceFeature
  featureGroups:TRaceFeatures
}

export const FeaturesList = (props:TFeaturesList) => {
  const {
    active,
    editingName,
    featureGroups,
    onEditFeature,
    onDeleteFeature,
    onActiveFeature
  } = props

  return (
    <Features
      component='nav'
      className='gb-features-list'
      aria-labelledby='nested-list-subheader'
    >
      <FeatureItemRender
        active={active}
        editingName={editingName}
        featureGroup={featureGroups}
        featureGroups={featureGroups}
        onEditFeature={onEditFeature}
        onDeleteFeature={onDeleteFeature}
        onActiveFeature={onActiveFeature}
      />
    </Features>
  )

}