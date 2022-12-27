import type { TEditorRefs } from '@GBR/types'

import { Panel } from '../../goblet'
import { FeaturesList } from './FeaturesList'

export type TFeaturesPanel = TEditorRefs & {

}

export const FeaturesPanel = (props:TFeaturesPanel) => {
  const { featuresRef } = props

  return (
    <Panel
      header
      startOpen
      actions={[]}
      title='Features'
    >
      <FeaturesList
        featuresRef={featuresRef}
      />
    </Panel>
  )
  
}