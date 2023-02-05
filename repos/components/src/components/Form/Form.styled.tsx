
import Box from '@mui/material/Box'
import MuiButton from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import FormLabel from '@mui/material/FormLabel'
import InputLabel from '@mui/material/InputLabel'
import MuiIconBtn from '@mui/material/IconButton'
import FormControl from '@mui/material/FormControl'

export const FormMain = styled(Box)``
export const FormContainer = styled(`form`)``
export const FormHeaderContainer = styled(Box)``
export const FormFooterContainer = styled(Box)``

// ----- Input Component ---- //
export const InputContainer = styled(Box)`
  margin-top: 10px;
  position: relative;

  &.disabled-input {
    cursor: pointer;
  }

  &.disabled-input input {
    cursor: text;
  }
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

const sharedInputStyle = `
  color: var(--goblet-input-foreground);
  background-color: var(--goblet-input-background);
  -webkit-text-fill-color: var(--goblet-input-foreground);
`

export const TextInput = styled(TextField)(({ theme }) => {
  const colors = theme?.palette?.colors
  return `
    width: 100%;

    & .MuiInput-root:hover:before {
      border-bottom: 1px solid ${colors.purple10} !important;
    }

    & .MuiInput-root:before {
      border-bottom: 1px solid var(--goblet-input-border);
    }

    & .MuiInput-root.Mui-disabled:before {
      border-bottom: 1px solid var(--goblet-input-border);
    }
    
    & .MuiFormHelperText-root {
      right: 0px;
      bottom: -23px;
      margin-right: 0px;
      position: absolute;
    }
    
    & input {
      height: 30px;
      min-height: 30px;
      padding: 5px 10px !important;
      ${sharedInputStyle}
    }

    & input:disabled {
      ${sharedInputStyle}
    }

    & .MuiInput-root.MuiInputBase-multiline {
      padding-right: 30px;
      padding-bottom: 0px;
    }

    & textarea {
      height: 30px;
      min-height: 30px;
      padding-top: 8px;
      padding-left: 10px;
      padding-right: 10px;
      padding-bottom: 2px;
      ${sharedInputStyle}
    }

    & textarea:disabled {
      ${sharedInputStyle}
    }

  `
})

export const TextInputContainer = styled(Box)`
  width: 100%;
  display: flex;
  min-height: 40px;
  align-items: center;
`

export const TextLabelWrap = styled(Box)`
  min-width: 80px;
  margin-right: 0px;
`

// ----- Input Component ---- //


// ----- Button Component ---- //
export const Button = styled(MuiButton)``
// ----- Button Component ---- //

// ----- Icon Button Component ---- //
export const IconBtnContainer = styled(Box)``

export const IconBtn = styled(MuiIconBtn)``

export const IconBtnLabel = styled(FormLabel)``

