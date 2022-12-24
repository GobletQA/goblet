import Box from '@mui/material/Box'
import { Text } from '../Text'
import { Scenarios } from '../Scenarios'
import { EmptyFeature } from './EmptyFeature'
import { useFeature } from '../../contexts'

export type TFeature = {
  
}

export const Feature = (props:TFeature) => {
  const { feature } = useFeature()
  const name = feature?.feature || `Select a feature from the right`

  return !feature || !feature?.uuid
    ? (<EmptyFeature />)
    : (
        <Box>
          <Text>
            <b>{name}</b>
          </Text>
          <Scenarios />
        </Box>
      )
}