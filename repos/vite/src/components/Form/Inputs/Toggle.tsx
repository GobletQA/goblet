import type { MouseEvent } from 'react'

import { useState } from 'react'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'

export type TToggle = {
  
}

export const Toggle = (props:TToggle) => {
  const [alignment, setAlignment] = useState('existing')

  const handleChange = (
    event: MouseEvent<HTMLElement>,
    newAlignment: string,
  ) => {
    setAlignment(newAlignment)
  }

  return (
    <ToggleButtonGroup
      exclusive
      color="primary"
      value={alignment}
      onChange={handleChange}
      aria-label="Platform"
    >
      <ToggleButton value="existing">Existing</ToggleButton>
      <ToggleButton value="create">Create</ToggleButton>
    </ToggleButtonGroup>
  )
}