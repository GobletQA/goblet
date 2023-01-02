import type { TMeta } from './Meta'
import type { TEditingProps } from '@GBR/types'

import { EMetaType } from '@GBR/types'
import { MetaInput } from './MetaInput'
import { MetaContainer } from './Meta.styled'
import { PerspectiveOpts } from '@GBR/constants'

export type TPerspective = TMeta & TEditingProps & {}

export const Perspective = (props:TPerspective) => {
  const {
    parent,
    editing,
    setEditing,
  } = props
  const { perspective } = parent

  return (
    <MetaContainer className='gr-feature-perspective' >

      <MetaInput
        editing={editing}
        setEditing={setEditing}
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