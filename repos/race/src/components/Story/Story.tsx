import type { MouseEventHandler } from 'react'
import type { TRaceFeature, TFeaturesRef } from '@GBR/types'

import { Desire } from './Desire'
import { Reason } from './Reason'
import { AddItem } from '../AddItem'
import { Section } from '../Section'
import { ESectionType } from '@GBR/types'
import { Perspective } from './Perspective'
import { addStory } from '@GBR/actions/story'
import { Container, Dropdown } from '../Shared'
import { stopEvent, IconButton, TrashIcon, useInline } from '@gobletqa/components'


export type TMeta = {
  parent:TRaceFeature
  featuresRef: TFeaturesRef
}

const styles = {
  add: {},
  header: {},
  headerContent: {},
  headerText: {}
}

export const Story = (props:TMeta) => {
  const { parent } = props

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
    <Container
      elevation={0}
      className='gr-user-story-container'
    >
      {hasStory ? (
        <Dropdown
          id={parent.uuid}
          initialExpand={true}
          headerText={`USER STORY`}
          headerSx={styles.header}
          headerTextSx={styles.headerText}
          headerContentSx={styles.headerContent}
          className='gr-user-story-dropdown'
          // actions={[
          //   <IconButton
          //     key='trash-story'
          //     Icon={TrashIcon}
          //     onClick={onTrash}
          //   />
          // ]}
        >
          <Section
            stack={2}
            type={ESectionType.feature}
          >
            <Perspective {...props} type={ESectionType.feature} />
            <Desire {...props} type={ESectionType.feature} />
            <Reason {...props} type={ESectionType.feature} />
          </Section>
        </Dropdown>
      ) : (
        <AddItem
          sx={styles.add}
          onClick={onClick}
          parentId={parent.uuid}
          type={ESectionType.story}
        >
          Add Story
        </AddItem>
      )}
    </Container>
  )
  
}