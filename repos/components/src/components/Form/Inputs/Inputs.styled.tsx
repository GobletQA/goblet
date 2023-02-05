import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import FormLabel from '@mui/material/FormLabel'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import ToggleButton from '@mui/material/ToggleButton'
import Autocomplete from '@mui/material/Autocomplete'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import MuiInputLabel from '@mui/material/InputLabel'

const sharedInputStyle = `
  color: var(--goblet-input-foreground);
  background-color: var(--goblet-input-background);
  -webkit-text-fill-color: var(--goblet-input-foreground);
`

// ----- Auto-Input Component ---- //

export const AutoContainer = styled(Box)`
  &.gc-auto-input-container-side {
    margin-top: 10px;
    position: relative;
  }
`

export const AutoInputControl = styled(FormControl)`
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

export const AutoInputContainer = styled(Box)`
  width: 100%;
  display: flex;
  min-height: 40px;
  align-items: center;
`

export const AutoLabel = styled(MuiInputLabel)`
  &.gc-auto-input-label {
    
  }

  &.gc-auto-label-side {
    padding: 0px;
  }

  &.gc-auto-label-inline {
    
  }

`

export const AutoLabelWrap = styled(Box)`

  &.gc-auto-label-wrap {
    margin-bottom: 5px;
  }
  
  &.gc-auto-label-wrap-inline {
    
  }

  &.gc-auto-label-wrap-side {
    min-width: 80px;
    margin-right: 0px;
  }

`

export const Auto = styled(Autocomplete)`

  &.gc-auto-input-side {
    width: 100%;
    padding: 0px;

    & .MuiAutocomplete-input::placeholder {
      font-style: italic;
    }
    
    & .MuiAutocomplete-endAdornment {
      opacity: 0 !important;
      display: none !important;
    }

  }
  
  &.gc-auto-input {
    padding-top: 0px;
    margin-bottom: 0px;
    padding-bottom: 0px;

    & .MuiTextField-root {
    
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
  }
`

export const AutoTextInput = styled(TextField)(({ theme }) => {
  const colors = theme?.palette?.colors
  return `
    &.gc-auto-input-text-side {

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
    }

  `
})



// ----- Input Component ---- //

export const InputContainer = styled(Box)``

export const InputLabel = styled(FormLabel)``

export const InputLabelWrap = styled(Box)`
  margin-bottom: 5px;
`

export const InputText = styled(TextField)`
  min-height: 40px;
  padding-top: 0px;
  margin-bottom: 0px;
  padding-bottom: 0px;

  & .MuiTextField-root {
    min-height: 40px;
  }

  & .MuiInputBase-root {
    min-height: 40px;
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

    & textarea::placeholder {
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
  font-size: 12px;
  padding: 5px 10px;
  text-transform: none;
`
export const ToggleGrp = styled(ToggleButtonGroup)``

