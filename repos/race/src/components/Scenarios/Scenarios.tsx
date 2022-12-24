
import { Text } from '../Text'
import Box from '@mui/material/Box'
import { Scenario } from './Scenario'
import { useModel } from '../../contexts'

export type TScenarios = {
  
} 

export const Scenarios = (props:TScenarios) => {
  const { model } = useModel()

  const { scenarios } = model

  return (
    <Box>
      <Text>
        <b>Scenarios</b>
      </Text>
      {scenarios.map(scenario => {
        return (
          <Scenario
            scenario={scenario}
            key={`${model.uuid}-${scenario.uuid}`}
          />
        )
      })}
    </Box>
  )
}