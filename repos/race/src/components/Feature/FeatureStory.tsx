import type { MouseEventHandler } from 'react'
import type { TRaceFeature, TFeaturesRef } from '@GBR/types'

import { Story } from '../Story'
import { AddItem } from '../AddItem'
import { Section } from '../Section'
import { ESectionType } from '@GBR/types'
import { addStory } from '@GBR/actions/story'
import { Container, Dropdown } from './Feature.styled'
import { stopEvent, IconButton, TrashIcon, useInline } from '@gobletqa/components'

export type TFeatureMeta = {
  parent:TRaceFeature
  featuresRef: TFeaturesRef
}

const styles = {
  add: {
    marginTop: `20px`,
    marginLeft: `-10px`,
  },
  header: {},
  headerContent: {},
  headerText: {}
}

export const FeatureStory = (props:TFeatureMeta) => {
  const { parent, featuresRef } = props

  const {
    desire,
    reason,
    perspective,
  } = parent
  
  const hasStory = Boolean(desire || reason || perspective)
  const onClick = useInline(() => addStory())
  
  const onTrash = useInline<MouseEventHandler<HTMLButtonElement>>((evt) => {
    stopEvent(evt)
    console.log(`------- on trash -------`)
  })

  return (
    <Container className='gr-user-story-container' >
      {hasStory ? (
        <Dropdown
          id={parent.uuid}
          initialExpand={true}
          headerText={`User Story`}
          headerSx={styles.header}
          headerTextSx={styles.headerText}
          headerContentSx={styles.headerContent}
          className='gr-user-story-dropdown'
          actions={[
            <IconButton
              key='trash-story'
              Icon={TrashIcon}
              onClick={onTrash}
            />
          ]}
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
      ) : (
        <AddItem
          sx={styles.add}
          onClick={onClick}
          parentId={parent.uuid}
          type={ESectionType.story}
        >
          Add User Story
        </AddItem>
      )}
    </Container>
  )
  
}