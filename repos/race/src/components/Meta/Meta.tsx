import type { TRaceFeature, TFeaturesRef } from '@GBR/types'

import { Tags } from '../Tags'
import { Title } from './Title'
import { Story } from '../Story'
import { Section } from '../Shared'
import { ESectionType } from '@GBR/types'
import { AddStory } from '../Actions/AddStory'
import { addStory } from '@GBR/actions/story'

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
      dropdownSx={{ marginBottom: `0px !important` }}
      actions={[
        AddStory({
          type: `story`,
          onClick: addStory,
        })
      ]}
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
      <Story
        parent={parent}
        featuresRef={featuresRef}
      />
    </Section>
  )
  
}