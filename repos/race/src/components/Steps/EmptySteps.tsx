import type { TStepParentAst } from '@GBR/types'

import Box from '@mui/material/Box'

export type TEmptySteps = {
  parent:TStepParentAst
}

export const EmptySteps = (props:TEmptySteps) => {

  return (
    <Box>
      Empty Steps
    </Box>
  )
}