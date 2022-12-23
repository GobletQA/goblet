import type { TFeatureFileModel } from '@types'
import Box from '@mui/material/Box'
import { useSelector } from '@store'
import { Features } from './Features'


export type TVisualEditor = {
  
}

export const VisualEditor = (props:TVisualEditor) => {


  return (
    <Box
      sx={{
        margin: `20px`
      }}
    >
      {`VisualEditor Form goes here :)`}
    </Box>
  )
}