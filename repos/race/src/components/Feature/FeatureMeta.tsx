import type { TFeaturesRef } from '@GBR/types'

import { Meta } from '../Meta'
import { Tags } from '../Tags'
import { Section } from '../Section'
import { ESectionType } from '@GBR/types'

export type TFeatureMeta = {
  type?:ESectionType
  featuresRef: TFeaturesRef
}

export const FeatureMeta = (props:TFeatureMeta) => {
  const {
    type,
    featuresRef
  } = props

  return (
    <Section
      stack={0}
      type={type || ESectionType.feature}
    >
      <Tags featuresRef={featuresRef} />
      <Meta />
    </Section>
  )
  
}