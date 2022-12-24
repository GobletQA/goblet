import type { TScenarioAst } from '@GBR/types'

import Box from '@mui/material/Box'

export type TEmptySteps = {
  scenario:TScenarioAst
}

export const EmptySteps = (props:TEmptySteps) => {

  return (
    <Box>
      Empty Steps
    </Box>
  )
}