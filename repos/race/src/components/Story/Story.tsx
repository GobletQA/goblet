import type { MouseEventHandler } from 'react'
import type { TRaceFeature, TFeaturesRef } from '@GBR/types'

import { Desire } from './Desire'
import { Reason } from './Reason'
import { Section } from '../Shared'
import { ESectionType } from '@GBR/types'
import { Perspective } from './Perspective'
import { Delete } from '../Actions/Delete'
import { addStory, removeStory } from '@GBR/actions/story'
import { stopEvent, useInline } from '@gobletqa/components'


export type TMeta = {
  parent:TRaceFeature
  featuresRef: TFeaturesRef
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
    removeStory()
  })

  return (
    <Section
      parent={parent}
      onAdd={onClick}
      label={`story`}
      show={hasStory}
      initialExpand={true}
      type={ESectionType.story}
      id={`${parent.uuid}-story`}
      className='gr-story-section'
      actions={[
        Delete({
          onClick: onTrash,
          type: ESectionType.story,
        })
      ]}
    >
      <Perspective {...props} type={ESectionType.feature} />
      <Desire {...props} type={ESectionType.feature} />
      <Reason {...props} type={ESectionType.feature} />
    </Section>
  )
  
}