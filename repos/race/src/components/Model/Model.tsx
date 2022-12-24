import Box from '@mui/material/Box'
import { Text } from '../Text'
import { Scenarios } from '../Scenarios'
import { EmptyModel } from './EmptyModel'
import { useModel } from '../../contexts'

export type TModel = {
  
}

export const Model = (props:TModel) => {
  const { model } = useModel()
  const name = model?.feature || `Select a model from the right`

  return !model || !model?.uuid
    ? (<EmptyModel />)
    : (
        <Box>
          <Text>
            <b>{name}</b>
          </Text>
          <Scenarios />
        </Box>
      )
}