import type { TTabAction } from '../../goblet'
import type { TFeaturesRefs } from '@GBR/types'

import { Panel } from '../../goblet'
import { FeaturesList } from './FeaturesList'

export type TFeaturesPanel = TFeaturesRefs & {
  onActiveFeature: TTabAction
}

export const FeaturesPanel = (props:TFeaturesPanel) => {
  const { featuresRef, onActiveFeature } = props

  return (
    <Panel
      header
      startOpen
      actions={[]}
      title='Features'
    >
      <FeaturesList
        featuresRef={featuresRef}
        onActiveFeature={onActiveFeature}
      />
    </Panel>
  )
  
}