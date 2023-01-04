import type { TMeta } from './Story'

import { EMetaType } from '@GBR/types'
import { MetaInputContainer } from './Meta.styled'
import { capitalize } from '@keg-hub/jsutils'
import { AutoInput } from '@gobletqa/components'
import { PerspectiveOpts } from '@GBR/constants'

export type TPerspective = TMeta & {}

export const Perspective = (props:TPerspective) => {
  const { parent } = props
  const { perspective } = parent

  return (
    <MetaInputContainer className='gr-feature-perspective gr-meta-input-container' >

      <AutoInput
        options={PerspectiveOpts}
        placeholder='As a user ...'
        id={`${parent.uuid}-perspective`}
        className='gr-feature-perspective'
        label={capitalize(EMetaType.persona)}
        value={perspective?.content || PerspectiveOpts[0]}
      />

    </MetaInputContainer>
  )
}