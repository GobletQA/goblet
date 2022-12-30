import type { TParentAst } from '@GBR/types'

import Box from '@mui/material/Box'

export type TEmptySteps = {
  parent:TParentAst
}

export const EmptySteps = (props:TEmptySteps) => {

  return (
    <Box>
      Empty Steps
    </Box>
  )
}