import type { TMeta } from './Story'

import { ESectionType, EMetaType } from '@GBR/types'
import { Input } from '@gobletqa/components'
import { capitalize } from '@keg-hub/jsutils'
import { MetaInputContainer } from './Story.styled'

export type TDesire = TMeta & {
  type: ESectionType
}

export const Desire = (props:TDesire) => {
  const { parent } = props
  const { desire } = parent

  return (
    <MetaInputContainer className='gr-feature-desire gr-meta-input-container' >
      <Input
        multiline={true}
        value={desire?.content}
        placeholder='I want to ...'
        id={`${parent.uuid}-desire`}
        className='gr-feature-desire'
        label={capitalize(EMetaType.desire)}
      />
    </MetaInputContainer>
  )
}