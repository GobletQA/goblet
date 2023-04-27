import type { TRaceFeature, TFeaturesRef } from '@GBR/types'

import { Tags } from '../Tags'
import { Title } from '../Title'
import { Story } from '../Story'
import Box from '@mui/material/Box'
import { addStory } from '@GBR/actions/story'
import { Section, SectionHeader } from '../Section'
import { ESectionType, ESectionExt } from '@GBR/types'

import { EmptyFeatureUUID } from '@GBR/constants'
import { useSettings } from '@GBR/contexts/SettingsContext'
import { useEditFeatureTitle } from '@GBR/hooks/features/useEditFeatureTitle'
import {
  gutter,
  useInline,
  stopEvent,
  NoteMinusIcon,
  UserDetailsIcon
} from '@gobletqa/components'


export type TMeta = {
  parent:TRaceFeature
  featuresRef: TFeaturesRef
  onTagsChange:(...args:any[]) => void
}

export const Meta = (props:TMeta) => {
  const { settings, toggleMeta } = useSettings()

  const {
    parent,
    featuresRef,
  } = props

  const onEditFeatureTitle = useEditFeatureTitle(props)

  const onHideMeta = useInline((evt:MouseEvent) => {
    stopEvent(evt)
    toggleMeta()
  })


  const onShowStory = useInline((evt:MouseEvent) => {
    stopEvent(evt)
    addStory()
  })

  // Always show if it's an empty feature without a title
  if(parent.uuid !== EmptyFeatureUUID && !settings?.displayMeta) return null

  return (
    <Section
      show={true}
      parent={parent}
      id={parent.uuid}
      label={
        <SectionHeader
          typeHidden
          content={`Feature Meta`}
          type={ESectionExt.general}
        />
      }
      type={ESectionType.feature}
      className='gb-feature-general-container'
      dropdownSx={{ marginBottom: `0px !important` }}
      actions={[
        {
          onClick: onShowStory,
          Icon: UserDetailsIcon,
          type: ESectionExt.story,
          label: `Add User Story`,
          key: `gb-general-add-story-action`,
        },
        {
          label: `Hide Meta`,
          Icon: NoteMinusIcon,
          onClick: onHideMeta,
          type: ESectionExt.general,
          key: `gb-general-toggle-general`,
        }
      ]}
    >
      <Box
        padding={gutter.padding.px}
        className='gb-feature-meta-top-content'
      >
        <Title
          autoFocus
          uuid={parent.uuid}
          value={parent.feature}
          type={ESectionType.feature}
          onBlur={onEditFeatureTitle}
        />
        <Tags
          parent={parent}
          featuresRef={featuresRef}
          type={ESectionType.feature}
        />
      </Box>
      <Story
        parent={parent}
        featuresRef={featuresRef}
      />
    </Section>
  )

}
