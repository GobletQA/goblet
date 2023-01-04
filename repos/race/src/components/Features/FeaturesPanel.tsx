import type { TTabAction } from '@gobletqa/components'
import type { TFeaturesRefs, TRaceFeatures } from '@GBR/types'

import { useEditor } from '@GBR/contexts'
import { Panel } from '@gobletqa/components'
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

  const { feature:active, rootPrefix } = useEditor()

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
        rootPrefix={rootPrefix}
        featureGroups={featureGroups}
        onActiveFeature={onActiveFeature}
      />
    </Panel>
  )
  
}