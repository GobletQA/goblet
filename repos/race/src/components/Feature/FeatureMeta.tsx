import type { TRaceFeature, TFeaturesRef } from '@GBR/types'

import { Meta } from '../Meta'
import { ESectionType } from '@GBR/types'
import { Dropdown } from '@gobletqa/components'
import { Section, SectionHeader } from '../Section'

export type TFeatureMeta = {
  parent:TRaceFeature
  featuresRef: TFeaturesRef
}

export const FeatureMeta = (props:TFeatureMeta) => {
  const { parent, featuresRef } = props

  return (
    <Dropdown
      id={parent.uuid}
      header={`Meta Data`}
    >
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
    </Dropdown>
  )
  
}