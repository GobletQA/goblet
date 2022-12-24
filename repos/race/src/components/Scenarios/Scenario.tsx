import { TScenarioAst } from '@GBR/types'

import { Text } from '../Text'
import { Steps } from '../Steps'
import Box from '@mui/material/Box'

export type TScenario = {
  scenario:TScenarioAst
} 

export const Scenario = (props:TScenario) => {
  const { scenario } = props

  return (
    <Box>
      <Text>
        {scenario?.scenario}
      </Text>
      <Steps scenario={scenario} />
    </Box>
  )
}