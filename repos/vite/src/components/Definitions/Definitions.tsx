import type { CSSProperties, SyntheticEvent } from 'react'

import { useCallback, useState } from 'react'
import Box from '@mui/material/Box'
import { DefinitionBody } from './DefinitionBody'
import { DefinitionHeader } from './DefinitionHeader'

export type TDefinitions = {
  sx?: CSSProperties
}

export const Definitions = (props:TDefinitions) => {
  const {
    sx
  } = props

  const [value, setValue] = useState(0)

  const onChange = useCallback((event: SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }, [])

  return (
    <Box sx={sx} >
      <DefinitionHeader
        value={value}
        onChange={onChange}
      />
      <DefinitionBody
        value={value}
        onChange={onChange}
      />
    </Box>
  )
  
}