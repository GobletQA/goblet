import type { TMeta } from './Story'

import { ESectionType, EMetaType } from '@GBR/types'
import { capitalize } from '@keg-hub/jsutils'
import { MetaInputContainer } from './Story.styled'
import { updateProperty } from '@GBR/actions/story/updateProperty'
import { stopEvent, useInline, Input } from '@gobletqa/components'

export type TDesire = TMeta & {
  type: ESectionType
}

export const Desire = (props:TDesire) => {
  const { parent } = props
  const { desire } = parent

  const onChange = useInline((evt, value) => {
    stopEvent(evt)
    updateProperty(`desire`, value, parent)
  })

  return (
    <MetaInputContainer className='gr-feature-desire gr-meta-input-container' >
      <Input
        multiline={true}
        onChange={onChange}
        value={desire?.content}
        placeholder='I want to ...'
        id={`${parent.uuid}-desire`}
        className='gr-feature-desire'
        label={capitalize(EMetaType.desire)}
      />
    </MetaInputContainer>
  )
}