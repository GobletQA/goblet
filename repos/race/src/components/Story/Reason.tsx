import type { TMeta } from './Story'

import { capitalize } from '@keg-hub/jsutils'
import { MetaInputContainer } from './Story.styled'
import { ESectionType, EMetaType } from '@GBR/types'
import { stopEvent, useInline, Input } from '@gobletqa/components'
import { updateProperty } from '@GBR/actions/story/updateProperty'

export type TReason = TMeta & {
  type: ESectionType
}

export const Reason = (props:TReason) => {
  const { parent } = props
  const { reason } = parent

  const onChange = useInline((evt, value) => {
    stopEvent(evt)
    updateProperty(`reason`, value, parent)
  })

  return (
    <MetaInputContainer className='gr-feature-reason gr-meta-input-container' >

      <Input
        multiline={true}
        onChange={onChange}
        value={reason?.content}
        placeholder='So that ...'
        id={`${parent.uuid}-reason`}
        className='gr-feature-reason'
        label={capitalize(EMetaType.reason)}
      />

    </MetaInputContainer>
  )
}