import type { TMeta } from './Meta'

import { EMetaType } from '@GBR/types'
import { MetaInput } from './MetaInput'
import { MetaContainer } from './Meta.styled'

export type TReason = TMeta & {}

export const Reason = (props:TReason) => {
  const { parent, type } = props
  const { reason } = parent

  return (
    <MetaContainer className='gr-feature-reason' >

      <MetaInput
        inputType='text'
        multiline={true}
        type={EMetaType.reason}
        value={reason?.content}
        placeholder='So that ...'
        id={`${parent.uuid}-reason`}
        className='gr-feature-reason'
      />

    </MetaContainer>
  )
}