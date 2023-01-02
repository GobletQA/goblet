import type { TTabAction } from '@gobletqa/components'
import type { TFeaturesRefs, TRaceFeatures } from '@GBR/types'

import { Panel } from '@gobletqa/components'
import { useFeature } from '@GBR/contexts'
import { FeaturesList } from './FeaturesList'
import { FeaturesActions } from './FeaturesActions'

export type TFeaturesPanel = TFeaturesRefs & {
  featureGroups:TRaceFeatures
  onActiveFeature: TTabAction
}

export const FeaturesPanel = (props:TFeaturesPanel) => {
  const {
    featureGroups,
    onActiveFeature,
  } = props

  const { feature:active } = useFeature()

  return (
    <Panel
      header
      startOpen
      fillHeight
      title='Features'
      actions={FeaturesActions}
    >
      <FeaturesList
        active={active}
        featureGroups={featureGroups}
        onActiveFeature={onActiveFeature}
      />
    </Panel>
  )
  
}