import type { MouseEventHandler } from 'react'
import type { TRaceFeature, TFeaturesRef } from '@GBR/types'

import { Desire } from './Desire'
import { Reason } from './Reason'
import { Section } from '../Section'
import { ESectionType } from '@GBR/types'
import { Perspective } from './Perspective'
import { DeleteAct } from '../Actions/Delete'
import { addStory, removeStory } from '@GBR/actions/story'
import { gutter, stopEvent, useInline } from '@gobletqa/components'


export type TMeta = {
  parent:TRaceFeature
  featuresRef: TFeaturesRef
}

const styles = {
  section: gutter.sx.marginTop
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
  
  const onRemove = useInline<MouseEventHandler<HTMLButtonElement>>((evt) => {
    stopEvent(evt)
    removeStory()
  })

  return (
    <Section
      parent={parent}
      label={`story`}
      show={hasStory}
      sx={styles.section}
      initialExpand={true}
      type={ESectionType.story}
      id={`${parent.uuid}-story`}
      className='gb-story-section'
      actions={[
        <DeleteAct
          onClick={onRemove}
          type={ESectionType.story}
          key={`gb-story-remove-action`}
        />
      ]}
    >
      <Perspective {...props} type={ESectionType.feature} />
      <Desire {...props} type={ESectionType.feature} />
      <Reason {...props} type={ESectionType.feature} />
    </Section>
  )
  
}