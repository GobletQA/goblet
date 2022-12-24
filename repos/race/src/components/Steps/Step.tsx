import type { TStepAst, TScenarioAst } from '@GBR/types'

import { Text } from '../Text'
import Box from '@mui/material/Box'

export type TStep = {
  step:TStepAst
  scenario:TScenarioAst
}

export const Step = (props:TStep) => {
  const {
    step,
    scenario
  } = props

  return (
    <Box>
      <Text>
        { step.step }
      </Text>
    </Box>
  )
}