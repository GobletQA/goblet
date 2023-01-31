import type { TMeta } from './Story'

import { Input } from '@gobletqa/components'
import { capitalize } from '@keg-hub/jsutils'
import { MetaInputContainer } from './Story.styled'
import { ESectionType, EMetaType } from '@GBR/types'

export type TReason = TMeta & {
  type: ESectionType
}

export const Reason = (props:TReason) => {
  const { parent } = props
  const { reason } = parent

  return (
    <MetaInputContainer className='gr-feature-reason gr-meta-input-container' >

      <Input
        multiline={true}
        value={reason?.content}
        placeholder='So that ...'
        id={`${parent.uuid}-reason`}
        className='gr-feature-reason'
        label={capitalize(EMetaType.reason)}
      />

    </MetaInputContainer>
  )
}