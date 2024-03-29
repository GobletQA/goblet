import type { SyntheticEvent, MouseEvent as RMouseEvent } from 'react'

import { DefinitionTabs } from '@constants'
import { useCallback, useState } from 'react'
import { DefinitionBody } from './DefinitionBody'
import { DefinitionHeader } from './DefinitionHeader'
import { DefsContainer } from './Definitions.styled'


export type TDefinitions = {
  onClose?:(event:MouseEvent | TouchEvent) => void
  onTabClick:(event:RMouseEvent<HTMLDivElement>) => void
}

export const Definitions = (props:TDefinitions) => {
  const { onClose, onTabClick } = props

  const [active, setActive] = useState(0)

  const onChange = useCallback((event: SyntheticEvent, newValue: number) => {
    setActive(newValue)
  }, [])

  return (
    <DefsContainer className='gb-definitions' >
      <DefinitionHeader
        active={active}
        onChange={onChange}
        tabs={DefinitionTabs}
        onTabClick={onTabClick}
      />
      <DefinitionBody
        active={active}
        onClose={onClose}
        onChange={onChange}
        tabs={DefinitionTabs}
      />
    </DefsContainer>
  )
  
}