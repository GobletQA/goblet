import type { TRaceFeature, TFeaturesRef } from '@GBR/types'

import { Tags } from '../Tags'
import { Title } from '../Title'
import { Story } from '../Story'
import { Section } from '../Section'
import { ESectionType } from '@GBR/types'
import { addStory } from '@GBR/actions/story'

import { AddStoryAct } from '../Actions/AddStory'
import { EmptyFeatureUUID } from '@GBR/constants'
import { ToggleMetaAct } from '../Actions/ToggleMeta'
import { useSettings } from '@GBR/contexts/SettingsContext'
import { useEditFeatureTitle } from '@GBR/hooks/features/useEditFeatureTitle'

export type TMeta = {
  parent:TRaceFeature
  featuresRef: TFeaturesRef
  onTagsChange:(...args:any[]) => void
}

export const Meta = (props:TMeta) => {
  const { settings } = useSettings()

  const {
    parent,
    featuresRef,
  } = props

  const onEditFeatureTitle = useEditFeatureTitle(props)

  // Always show if it's an empty feature without a title
  if(parent.uuid !== EmptyFeatureUUID && !settings.displayMeta) return null

  return (
    <Section
      show={true}
      parent={parent}
      id={parent.uuid}
      label={`general`}
      initialExpand={true}
      type={ESectionType.feature}
      className='gb-feature-general-container'
      dropdownSx={{ marginBottom: `0px !important` }}
      actions={[
        (
          <AddStoryAct
            onClick={addStory}
            type={ESectionType.story}
            title={`Add User Story`}
            key={`gb-general-add-story-action`}
          />
        ),
        (
          <ToggleMetaAct
            key={`gb-general-toggle-general`}
          />
        )
      ]}
    >
      <Title
        uuid={parent.uuid}
        value={parent.feature}
        type={ESectionType.feature}
        onChange={onEditFeatureTitle}
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