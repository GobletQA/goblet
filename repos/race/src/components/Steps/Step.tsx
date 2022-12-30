import type { TStepAst, TStepParentAst } from '@GBR/types'

import { Text } from '../Text'
import Box from '@mui/material/Box'

export type TStep = {
  step:TStepAst
  parent:TStepParentAst
}

export const Step = (props:TStep) => {
  const {
    step,
    parent
  } = props

  return (
    <Box className='gr-step' >
      <Text className='gr-step-text' >
        { step?.step }
      </Text>
    </Box>
  )
}