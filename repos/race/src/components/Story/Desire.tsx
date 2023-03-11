import type { TMeta } from './Story'
import type { ChangeEvent } from 'react'

import { ESectionType, EMetaType } from '@GBR/types'
import { capitalize } from '@keg-hub/jsutils'
import { MetaInputContainer } from './Story.styled'
import { updateProperty } from '@GBR/actions/story/updateProperty'
import { stopEvent, useInline, InlineInput } from '@gobletqa/components'

export type TDesire = TMeta & {
  type: ESectionType
}

export const Desire = (props:TDesire) => {
  const { parent } = props
  const { desire } = parent

  const onBlur = useInline((evt:ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
    stopEvent(evt)
    updateProperty(`desire`, evt.target.value, parent)
  })

  return (
    <MetaInputContainer className='gr-feature-desire gr-meta-input-container' >
      <InlineInput
        onBlur={onBlur}
        multiline={true}
        value={desire?.content}
        placeholder='I want to ...'
        id={`${parent.uuid}-desire`}
        className='gr-feature-desire'
        label={capitalize(EMetaType.desire)}
      />
    </MetaInputContainer>
  )
}