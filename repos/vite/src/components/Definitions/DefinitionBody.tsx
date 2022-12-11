import type { TDefGroups } from '@types'
import type { DefinitionTabs } from '@constants'
import type { TDefsList } from './List/DefaultDefsList'
import type { ElementType, CSSProperties, SyntheticEvent } from 'react'


import { useMemo } from 'react'
import { useDefGroups } from '@hooks/defs'
import { DefsBody } from './Definitions.styled'
import { AllDefsList } from './List/AllDefsList'
import { CustomDefsList } from './List/CustomDefsList'
import { DefaultDefsList } from './List/DefaultDefsList'

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
  const { allDefs, defaultDefs, customDefs } = useDefGroups()

  const [Component, definitions] = useMemo(() => {
    return ([
      [AllDefsList, allDefs],
      [DefaultDefsList, defaultDefs],
      [CustomDefsList, customDefs],
    ])[idx] as [ElementType<TDefsList>, TDefGroups]
  }, [idx, defaultDefs, customDefs, allDefs])

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