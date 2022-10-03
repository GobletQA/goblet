import type { ComponentProps } from 'react'

import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'

export type TLoading = ComponentProps<typeof CircularProgress> & {
  
}

export const FormLoading = (props:TLoading) => {
  const {
    ...progProps
  } = props
  
  return (
    <Box className="loading-container">
      <CircularProgress {...progProps} />
    </Box>
  )
}
