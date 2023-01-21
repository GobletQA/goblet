import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import FormLabel from '@mui/material/FormLabel'
import TextField from '@mui/material/TextField'
import ToggleButton from '@mui/material/ToggleButton'
import Autocomplete from '@mui/material/Autocomplete'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'

export const AutoContainer = styled(Box)`
  margin-bottom: 10px;
`

export const AutoLabel = styled(FormLabel)``

export const AutoLabelWrap = styled(Box)`
  margin-bottom: 5px;
`

export const Auto = styled(Autocomplete)`
  height: 40px;
  padding-top: 0px;
  margin-bottom: 0px;
  padding-bottom: 0px;

  & .MuiTextField-root {
    height: 40px;
  }

  & .MuiInputBase-root {
    height: 40px;
    padding-top: 0px;
    padding-bottom: 0px;

    & input {
      height: 40px;
      padding-top: 0px !important;
      padding-bottom: 0px !important;
    }

    & input::placeholder {
      font-size: 14px;
    }
  }
`

export const InputContainer = styled(Box)`
  margin-bottom: 10px;
`

export const InputLabel = styled(FormLabel)``

export const InputLabelWrap = styled(Box)`
  margin-bottom: 5px;
`

export const InputText = styled(TextField)`
  height: 40px;
  padding-top: 0px;
  margin-bottom: 0px;
  padding-bottom: 0px;

  & .MuiTextField-root {
    height: 40px;
  }

  & .MuiInputBase-root {
    height: 40px;
    padding-top: 0px;
    padding-bottom: 0px;

    & input {
      height: 40px;
      padding-top: 0px !important;
      padding-bottom: 0px !important;
    }

    & input::placeholder {
      font-size: 14px;
    }
  }
`

export const ToggleContainer = styled(Box)`
  display: flex;
  align-items: start;
  margin-bottom: 10px;
  flex-direction: column;
  justify-content: start;
`

export const ToggleLabel = styled(FormLabel)`
  margin-bottom: 5px;
`

export const ToggleWrap = styled(Box)`
`

export const ToggleBtn = styled(ToggleButton)`
  height: 40px;
  padding: 5px 10px;
  text-transform: none;
`
export const ToggleGrp = styled(ToggleButtonGroup)``

