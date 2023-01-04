import type { TMeta } from './Story'

import { EMetaType } from '@GBR/types'
import { Input } from '@gobletqa/components'
import { capitalize } from '@keg-hub/jsutils'
import { MetaInputContainer } from './Meta.styled'

export type TReason = TMeta & {}

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