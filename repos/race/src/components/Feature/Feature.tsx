import type { TFeaturesRefs } from '@GBR/types'

import { Rules } from '../Rules'
import { Scenarios } from '../Scenarios'
import { ESectionType } from '@GBR/types'
import { Background } from '../Background'
import { FeatureMeta } from './FeatureMeta'
import { useFeature } from '../../contexts'
import { Section, SectionHeader } from '../Section'
import { Empty } from '@GBR/components/Empty'

export type TFeature = TFeaturesRefs & {
  
}

export const Feature = (props:TFeature) => {
  const {
    stepsRef,
    featuresRef,
  } = props

  const { feature } = useFeature()

  return !feature || !feature?.uuid
    ? (<Empty />)
    : (
        <Section
          stack={2}
          gutter={true}
          sx={{ paddingTop: `12px` }}
          type={ESectionType.feature}
        >
          <SectionHeader
            title={feature?.feature}
            variant={`h3`}
            underline={true}
            type={ESectionType.feature}
          />
          <FeatureMeta
            parent={feature}
            featuresRef={featuresRef}
          />
          <Background
            parent={feature}
            background={feature.background}
          />
          <Rules
            parent={feature}
            rules={feature.rules}
          />
          <Scenarios
            parent={feature}
            scenarios={feature.scenarios}
          />
        </Section>
      )
}