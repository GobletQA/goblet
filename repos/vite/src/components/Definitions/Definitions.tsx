import type { SyntheticEvent } from 'react'

import Box from '@mui/material/Box'
import { DefinitionTabs } from '@constants'
import { useCallback, useState } from 'react'
import { DefinitionBody } from './DefinitionBody'
import { DefinitionHeader } from './DefinitionHeader'

export type TDefinitions = {}

export const Definitions = (props:TDefinitions) => {

  const [tab, setTab] = useState(0)

  const onChange = useCallback((event: SyntheticEvent, newValue: number) => {
    setTab(newValue)
  }, [])

  return (
    <Box className='goblet-definitions' >
      <DefinitionHeader
        active={tab}
        onChange={onChange}
        tabs={DefinitionTabs}
      />
      <DefinitionBody
        active={tab}
        onChange={onChange}
        tabs={DefinitionTabs}
      />
    </Box>
  )
  
}