import type { TFeaturesRefs } from '@GBR/types'


import { FeatureMeta } from './FeatureMeta'
import { Scenarios } from '../Scenarios'
import { Background } from '../Background'
import { ESectionType } from '@GBR/types'
import { useFeature } from '../../contexts'
import { EmptyFeature } from './EmptyFeature'
import { Section, SectionHeader } from '../Section'


export type TFeature = TFeaturesRefs & {
  
}

export const Feature = (props:TFeature) => {
  const {
    stepsRef,
    featuresRef,
  } = props

  const { feature } = useFeature()
  const name = feature?.feature || `Select a feature from the right`

  return !feature || !feature?.uuid
    ? (<EmptyFeature />)
    : (
        <Section
          stack={2}
          gutter={true}
          sx={{ paddingTop: `12px` }}
          type={ESectionType.feature}
        >
          <SectionHeader
            title={name}
            variant={`h3`}
            underline={true}
            type={ESectionType.feature}
          />
          <FeatureMeta featuresRef={featuresRef} />
          <Background />
          <Scenarios />
        </Section>
      )
}