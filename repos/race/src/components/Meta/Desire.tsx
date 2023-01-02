import type { TMeta } from './Meta'
import type { TEditingProps } from '@GBR/types'

import { EMetaType } from '@GBR/types'
import { MetaInput } from './MetaInput'
import { MetaContainer } from './Meta.styled'

export type TDesire = TMeta & TEditingProps & {}

export const Desire = (props:TDesire) => {
  const { parent, type } = props
  const { desire } = parent

  return (
    <MetaContainer className='gr-feature-desire' >

      <MetaInput
        inputType='text'
        multiline={true}
        type={EMetaType.desire}
        value={desire?.content}
        placeholder='I want to ...'
        id={`${parent.uuid}-desire`}
        className='gr-feature-desire'
      />

    </MetaContainer>
  )
}