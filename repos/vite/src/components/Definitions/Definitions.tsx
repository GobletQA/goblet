import type { SyntheticEvent, MouseEvent } from 'react'

import Box from '@mui/material/Box'
import { DefinitionTabs } from '@constants'
import { useCallback, useState } from 'react'
import { DefinitionBody } from './DefinitionBody'
import { DefinitionHeader } from './DefinitionHeader'
import { DefsContainer } from './Definitions.styled'


export type TDefinitions = {
  onTabClick:(event:MouseEvent<HTMLDivElement>) => void
}

export const Definitions = (props:TDefinitions) => {
  const { onTabClick } = props

  const [active, setActive] = useState(0)

  const onChange = useCallback((event: SyntheticEvent, newValue: number) => {
    setActive(newValue)
  }, [])

  return (
    <DefsContainer className='goblet-definitions' >
      <DefinitionHeader
        active={active}
        onChange={onChange}
        tabs={DefinitionTabs}
        onTabClick={onTabClick}
      />
      <DefinitionBody
        active={active}
        onChange={onChange}
        tabs={DefinitionTabs}
      />
    </DefsContainer>
  )
  
}