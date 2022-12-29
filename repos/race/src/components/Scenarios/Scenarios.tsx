
import { Text } from '../Text'
import Box from '@mui/material/Box'
import { Scenario } from './Scenario'
import { useFeature } from '../../contexts'

export type TScenarios = {
  
} 

export const Scenarios = (props:TScenarios) => {
  const { feature } = useFeature()

  const { scenarios } = feature

  return (
    <Box>
      {scenarios.map(scenario => {
        return (
          <Scenario
            scenario={scenario}
            key={`${feature.uuid}-${scenario.uuid}`}
          />
        )
      })}
    </Box>
  )
}