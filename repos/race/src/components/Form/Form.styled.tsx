import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'

export const TextInputControl = styled(FormControl)`
  width: 100%;

  & .MuiFormLabel-root {
    transform: none;
    position: initial;
    overflow: initial;
    transition: none;
  }

  & .MuiInputBase-root {

  }
`

export const TextInputLabel = styled(InputLabel)`
  padding: 0px;
`

export const TextInput = styled(TextField)`
  width: 100%;
`

export const TextInputContainer = styled(Box)`
  width: 100%;
  display: flex;
  align-items: center;
`

export const TextLabelWrap = styled(Box)`
  min-width: 80px;
  margin-right: 20px;
`