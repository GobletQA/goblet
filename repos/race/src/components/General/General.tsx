import type { TRaceFeature, TFeaturesRef } from '@GBR/types'

import { Tags } from '../Tags'
import { Title } from './Title'
import { Story } from '../Story'
import { Section } from '../Section'
import { ESectionType } from '@GBR/types'
import { addStory } from '@GBR/actions/story'

import { AddStoryAct } from '../Actions/AddStory'
import { EmptyFeatureUUID } from '@GBR/constants'
import { ToggleGeneralAct } from '../Actions/ToggleGeneral'
import { useSettings } from '@GBR/contexts/SettingsContext'

export type TFeatureGeneral = {
  parent:TRaceFeature
  featuresRef: TFeaturesRef
}

export const General = (props:TFeatureGeneral) => {
  const { settings } = useSettings()

  const {
    parent,
    featuresRef,
  } = props

  // Always show if it's an empty feature without a title
  if(parent.uuid !== EmptyFeatureUUID && !settings.displayGeneral) return null

  return (
    <Section
      show={true}
      parent={parent}
      id={parent.uuid}
      label={`general`}
      initialExpand={true}
      type={ESectionType.feature}
      className='gr-feature-general-container'
      dropdownSx={{ marginBottom: `0px !important` }}
      actions={[
        (
          <AddStoryAct
            onClick={addStory}
            type={ESectionType.story}
            key={`gr-general-add-story-action`}
          />
        ),
        (
          <ToggleGeneralAct
            key={`gr-general-toggle-general`}
          />
        )
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