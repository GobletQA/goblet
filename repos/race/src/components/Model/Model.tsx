import { Steps } from '../Steps'
import Box from '@mui/material/Box'
import { useModel } from '../../contexts'

export type TModel = {
  
}

export const Model = (props:TModel) => {
  const { model } = useModel()
  const name = model.feature || `Select a model from the right`

  return (
    <Box>
      Active Model: {name}
      <Steps
      />
    </Box>
  )
}