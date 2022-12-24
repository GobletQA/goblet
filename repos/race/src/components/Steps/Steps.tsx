import type { TScenarioAst } from '@GBR/types'

import { Step } from './Step'
import { Text } from '../Text'
import Box from '@mui/material/Box'
import { EmptySteps } from './EmptySteps'


export type TSteps = {
  scenario:TScenarioAst
}

export const Steps = (props:TSteps) => {
  const {
    scenario
  } = props

  return (
    <Box>
      <Text>
        <b>Steps</b>
      </Text>
      {
        !scenario?.steps?.length
          ? (<EmptySteps scenario={scenario} />)
          : scenario?.steps.map(step => {
              return (
                <Step
                  step={step}
                  scenario={scenario}
                  key={`${scenario.uuid}-${step.uuid}`}
                />
              )
            })
      }
    </Box>
  )
}