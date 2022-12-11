import type { CSSProperties, SyntheticEvent } from 'react'
import type { DefinitionTabs } from '@constants'

import { useDefGroups } from '@hooks/defs'
import { CustomDefsList } from './List/CustomDefsList'
import { DefaultDefsList } from './List/DefaultDefsList'
import { DefsBody } from './Definitions.styled'

const TabComps = [DefaultDefsList, CustomDefsList]

export type TDefinitionsBody = {
  sx?:CSSProperties
  active:number
  tabs: typeof DefinitionTabs
  onChange:(event: SyntheticEvent, value: number) => any
}

export const DefinitionBody = (props:TDefinitionsBody) => {
  const {
    sx,
    tabs,
    active,
  } = props

  const idx = active | 0
  const Component = TabComps[idx]

  const definitions = useDefGroups()

  return (
    <DefsBody className='goblet-defs-body' sx={sx} >
      <Component
        index={idx}
        tab={tabs[active]}
        definitions={definitions}
      />
    </DefsBody>
  )

}