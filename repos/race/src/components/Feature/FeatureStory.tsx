import type { TRaceFeature, TFeaturesRef } from '@GBR/types'

import { Container, Dropdown } from './Feature.styled'
import { Story } from '../Story'
import { Section } from '../Section'
import { ESectionType } from '@GBR/types'


export type TFeatureMeta = {
  parent:TRaceFeature
  featuresRef: TFeaturesRef
}

export const FeatureStory = (props:TFeatureMeta) => {
  const { parent, featuresRef } = props

  return (
    <Container className='gr-user-story-container' >
      <Dropdown
        id={parent.uuid}
        initialExpand={true}
        headerText={`User Stroy`}
        className='gr-user-story-dropdown'
      >
        <Section
          stack={2}
          type={ESectionType.feature}
        >
          <Story
            parent={parent}
            featuresRef={featuresRef}
            type={ESectionType.feature}
          />
        </Section>
      </Dropdown>
    </Container>
  )
  
}