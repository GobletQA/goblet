import type { TRaceFeature, TFeaturesRef } from '@GBR/types'

import { Tags } from '../Tags'
import { Title } from './Title'
import { Section } from '../Shared'
import { ESectionType } from '@GBR/types'

export type TFeatureMeta = {
  parent:TRaceFeature
  featuresRef: TFeaturesRef
}

export const Meta = (props:TFeatureMeta) => {
  
  const {
    parent,
    featuresRef,
  } = props

  return (
    <Section
      show={true}
      parent={parent}
      id={parent.uuid}
      label={`general`}
      initialExpand={true}
      type={ESectionType.feature}
      className='gr-feature-meta-container'
    >
      <Title
        parent={parent}
        featuresRef={featuresRef}
      />
      <Tags
        parent={parent}
        featuresRef={featuresRef}
        type={ESectionType.feature}
      />
    </Section>
  )
  
}