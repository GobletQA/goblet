import type { TFeaturesRefs } from '@GBR/types'

import { useEffect } from 'react'

import { Rules } from '../Rules'
import { Scenarios } from '../Scenarios'
import { Background } from '../Background'
import { FeatureMeta } from './FeatureMeta'
import { useFeature } from '../../contexts'
import { wordCaps } from '@keg-hub/jsutils'
import { Empty } from '@GBR/components/Empty'
import { Section, SectionHeader } from '../Section'
import { EEditKey, ESectionType } from '@GBR/types'
import { createFeature } from '@gobletqa/race/actions/feature/createFeature'

export type TFeature = TFeaturesRefs & {
  
}


export const Feature = (props:TFeature) => {
  const {
    stepsRef,
    featuresRef,
  } = props

  const { feature, rootPrefix } = useFeature()

  // TODO: remove this once form components are done
  useEffect(() => {
    ;(!feature || !feature?.uuid) && createFeature({}, rootPrefix)
  }, [])


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
            variant={`h3`}
            required={true}
            underline={true}
            title={feature?.feature}
            type={ESectionType.feature}
            label={wordCaps(`${ESectionType.feature} Title`)}
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