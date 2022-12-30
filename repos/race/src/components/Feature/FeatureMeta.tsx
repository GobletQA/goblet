import type { TRaceFeature, TFeaturesRef } from '@GBR/types'

import { Meta } from '../Meta'
import { Section } from '../Section'
import { ESectionType } from '@GBR/types'

export type TFeatureMeta = {
  parent:TRaceFeature
  featuresRef: TFeaturesRef
}

export const FeatureMeta = (props:TFeatureMeta) => {
  const { parent, featuresRef } = props

  return (
    <Section
      stack={2}
      type={ESectionType.feature}
    >
      <Meta
        parent={parent}
        featuresRef={featuresRef}
        type={ESectionType.feature}
      />
    </Section>
  )
  
}