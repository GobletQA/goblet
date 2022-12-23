import type { TFeatureFileModel } from '@types'
import Box from '@mui/material/Box'
import { useSelector } from '@store'
import { Features } from './Features'


export type TBuilder = {
  
}

export const Builder = (props:TBuilder) => {


  return (
    <Box
      sx={{
        margin: `20px`
      }}
    >
      {`Builder Form goes here :)`}
    </Box>
  )
}