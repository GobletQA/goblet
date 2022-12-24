import type { TFeatureFileModel } from '@types'
import Box from '@mui/material/Box'
import { useSelector } from '@store'
import { Features } from './Features'
import { BlockIcon } from '@components/Icons'
import { NotConnected } from '@components/NotConnected'

export type TVisualEditor = {
  
}

export const VisualEditor = (props:TVisualEditor) => {

  return (
    <Box
      sx={{
        margin: `20px`
      }}
    >
      VisualEditor Form goes here :)
    <NotConnected
      Icon={BlockIcon}
      message='Repository not connected'
    />
    </Box>
  )
}