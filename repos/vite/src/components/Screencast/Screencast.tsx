import type { CSSProperties } from 'react'

import Box from '@mui/material/Box'
import { noOpObj } from '@keg-hub/jsutils'
import Container from '@mui/material/Container'

export type TScreencastProps = {
  sx?: CSSProperties
  sSx?: CSSProperties
}

export const Screencast = (props:TScreencastProps) => {
  return (
    <Container
      className='screencast-container'
      sx={[{
        display: `flex`,
        minHeight: `100%`,
        alignItems: `stretch`,
        backgroundColor: `#9a9a9a`,
      }, props.sx || noOpObj]}
    >
      <Box
        className='screencast-element'
        sx={[{ width: '100%' }, props.sSx || noOpObj]}
      >
        Screencast
      </Box>
    </Container>
  )
}