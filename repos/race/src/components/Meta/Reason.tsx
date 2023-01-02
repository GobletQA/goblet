import type { TMeta } from './Meta'
import type { TEditingProps } from '@GBR/types'

import { EMetaType } from '@GBR/types'
import { MetaInput } from './MetaInput'
import { MetaContainer } from './Meta.styled'

export type TReason = TMeta & TEditingProps & {}

export const Reason = (props:TReason) => {
  const {
    parent,
    editing,
    setEditing,
  } = props
  const { reason } = parent

  return (
    <MetaContainer className='gr-feature-reason' >

      <MetaInput
        inputType='text'
        multiline={true}
        editing={editing}
        setEditing={setEditing}
        type={EMetaType.reason}
        value={reason?.content}
        placeholder='So that ...'
        id={`${parent.uuid}-reason`}
        className='gr-feature-reason'
      />

    </MetaContainer>
  )
}