import type { TMeta } from './Story'

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

  const onChange = useInline((evt, value) => {
    stopEvent(evt)
    updateProperty(`perspective`, value, parent)
  })

  return (
    <MetaInputContainer className='gr-feature-perspective gr-meta-input-container' >

      <AutoInput
        labelSide={true}
        variant='standard'
        onChange={onChange}
        options={PerspectiveOpts}
        placeholder='As a user ...'
        id={`${parent.uuid}-perspective`}
        name={`feature-story-perspective`}
        className='gr-feature-perspective'
        label={capitalize(EMetaType.persona)}
        currentValue={perspective?.content || PerspectiveOpts[0]}
      />

    </MetaInputContainer>
  )
}