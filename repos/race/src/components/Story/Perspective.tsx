import type { TMeta } from './Story'
import type { ChangeEvent } from 'react'

import { capitalize } from '@keg-hub/jsutils'
import { PerspectiveOpts } from '@GBR/constants'
import { ESectionType, EMetaType } from '@GBR/types'
import { MetaInputContainer } from './Story.styled'
import { updateProperty } from '@GBR/actions/story/updateProperty'
import { AutoInput, stopEvent, useInline } from '@gobletqa/components'

export type TPerspective = TMeta & {
  type: ESectionType
}

export const Perspective = (props:TPerspective) => {
  const { parent } = props
  const { perspective } = parent

  const onBlur = useInline((evt:ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
    stopEvent(evt)
    updateProperty(`perspective`, evt?.target?.value, parent)
  })

  return (
    <MetaInputContainer className='gb-feature-perspective gb-meta-input-container' >

      <AutoInput
        onBlur={onBlur}
        freeSolo={true}
        labelSide={true}
        variant='standard'
        options={PerspectiveOpts}
        placeholder='As a user ...'
        id={`${parent.uuid}-perspective`}
        name={`feature-story-perspective`}
        className='gb-feature-perspective'
        label={capitalize(EMetaType.persona)}
        currentValue={perspective?.content || PerspectiveOpts[0]}
      />

    </MetaInputContainer>
  )
}