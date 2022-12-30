import type { TMeta } from './Meta'

import { EMetaType } from '@GBR/types'
import { MetaInput } from './MetaInput'
import { MetaContainer } from './Meta.styled'
import { PerspectiveOpts } from '@GBR/constants'

export type TPerspective = TMeta & {}

export const Perspective = (props:TPerspective) => {
  const { parent, type } = props
  const { perspective } = parent

  return (
    <MetaContainer className='gr-feature-perspective' >

      <MetaInput
        options={PerspectiveOpts}
        type={EMetaType.persona}
        placeholder='As a user ...'
        id={`${parent.uuid}-perspective`}
        className='gr-feature-perspective'
        value={perspective?.content || PerspectiveOpts[0]}
      />

    </MetaContainer>
  )
}