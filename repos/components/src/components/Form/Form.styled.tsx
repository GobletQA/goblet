
import Box from '@mui/material/Box'
import { TGobletTheme } from '@GBC/types'
import MuiButton from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import FormLabel from '@mui/material/FormLabel'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import MuiIconBtn from '@mui/material/IconButton'
import { getColor } from '@GBC/utils/theme/getColor'

export const FromContainer = styled(Box)``

// ----- Input Component ---- //
export const InputContainer = styled(Box)`
  position: relative;
`

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

export const TextInput = styled(TextField)(({ theme }) => {
  const inputColor = getColor(`colors.black19`, `colors.white`, theme)
  return `
    width: 100%;
    
    & .MuiFormHelperText-root {
      right: 0px;
      bottom: -23px;
      margin-right: 0px;
      position: absolute;
    }
    
    & input {
      color: ${inputColor};
      -webkit-text-fill-color: ${inputColor};
    }

    & input:disabled {
      color: ${inputColor};
      -webkit-text-fill-color: ${inputColor};
    }

  `
})

export const TextInputContainer = styled(Box)`
  width: 100%;
  display: flex;
  align-items: center;
`

export const TextLabelWrap = styled(Box)`
  min-width: 80px;
  margin-right: 20px;
`

// ----- Input Component ---- //


// ----- Button Component ---- //
export const Button = styled(MuiButton)``
// ----- Button Component ---- //

// ----- Icon Button Component ---- //
export const IconBtnContainer = styled(Box)``

export const IconBtn = styled(MuiIconBtn)``

export const IconBtnLabel = styled(FormLabel)``


// ----- Icon Button Component ---- //


// ----- Input Actions Component ---- //
export const InputActionsContainer = styled(Box)`
  top: 0px;
  right: 0px;
  height: 100%;
  display: flex;
  position: absolute;
  align-items: center;
`


// ----- Input Actions Component ---- //
