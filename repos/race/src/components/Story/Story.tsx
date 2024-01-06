import type { MouseEventHandler } from 'react'
import type { TRaceFeature } from '@GBR/types'

import { Desire } from './Desire'
import { Reason } from './Reason'
import { useCallback } from 'react'
import { Section } from '../Section'
import { Perspective } from './Perspective'
import { removeStory } from '@GBR/actions/story'
import { ESectionExt, ESectionType } from '@GBR/types'
import {
  gutter,
  TrashIcon,
  stopEvent,
} from '@gobletqa/components'


export type TMeta = {
  parent:TRaceFeature
}

const styles = {
  section: {
    border: `none`,
    ...gutter.sx.marginTop,
    ...gutter.sx.paddingV
  },
}

export const Story = (props:TMeta) => {
  const { parent } = props

  const {
    desire,
    reason,
    perspective,
  } = parent
  
  const hasStory = Boolean(desire || reason || perspective)
  
  const onRemove = useCallback<MouseEventHandler<HTMLButtonElement>>((evt) => {
    stopEvent(evt)
    removeStory()
  }, [])

  return (
    <Section
      parent={parent}
      label={`story`}
      show={hasStory}
      sx={styles.section}
      type={ESectionExt.story}
      id={`${parent.uuid}-story`}
      className='gb-story-section'
      actions={[{
        Icon: TrashIcon,
        onClick: onRemove,
        type: ESectionExt.story,
        label: `Remove User Story`,
        key: `gb-story-remove-action`,
      }]}
    >
      <Perspective {...props} type={ESectionType.feature} />
      <Desire {...props} type={ESectionType.feature} />
      <Reason {...props} type={ESectionType.feature} />
    </Section>
  )
  
}