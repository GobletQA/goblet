import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import Autocomplete from '@mui/material/Autocomplete'
import FormControl from '@mui/material/FormControl'

export const MetaLabel = styled(InputLabel)`
  padding: 0px;
`

export const MetaContainer = styled(Box)``

export const MetaInputComp = styled(TextField)`
  width: 100%;
`

export const MetaFormControl = styled(FormControl)`
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

export const MetaAutoComp = styled(Autocomplete)`
  width: 100%;
  padding: 0px;
  & .MuiAutocomplete-input::placeholder {
    font-style: italic;
  }
`

export const MetaInputContainer = styled(Box)`
  width: 100%;
  display: flex;
  align-items: center;
`

export const MetaLabelWrap = styled(Box)`
  min-width: 80px;
  margin-right: 20px;
`