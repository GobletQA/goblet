import type { TTabAction } from '@gobletqa/components'
import type { TFeaturesRefs } from '@GBR/types'

import { Panel } from '@gobletqa/components'
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