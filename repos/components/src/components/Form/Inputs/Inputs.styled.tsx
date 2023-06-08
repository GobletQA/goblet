import { gutter } from '@GBC/theme'
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
  &.gb-auto-input-container-side {
    position: relative;
    margin-top: ${gutter.margin.px};
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
    & .MuiInputAdornment-root {
      margin-right: 0px;
    }
  }
`

export const AutoInputContainer = styled(Box)`
  width: 100%;
  display: flex;
  min-height: 40px;
  align-items: center;
`

export const Auto = styled(Autocomplete)`

  &.gb-auto-input-side {
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
  
  &.gb-auto-input {
    padding-top: 0px;
    margin-bottom: 0px;
    padding-bottom: 0px;

    & .MuiTextField-root {
    
    }

    & .MuiInputBase-root {
      height: 40px;
      padding-top: 0px;
      padding-bottom: 0px;
      padding-right: 30px;

      &.MuiInputBase-adornedStart {
        padding-left: 5px;
        padding-right: 30px;
      }

      & input {
        height: 40px;
        padding: 0px !important;
      }

      & input::placeholder {
        font-size: 14px;
      }
    }
    
    & .MuiAutocomplete-clearIndicator {
      display: none;
    }
  }
`

export const AutoTextInput = styled(TextField)(({ theme }) => {
  const colors = theme?.palette?.colors
  return `
    &.gb-auto-input-text-side {

      width: 100%;

      & .MuiInputBase-root:hover:before, .MuiInput-root:hover:before {
        border-bottom: 1px solid ${colors.purple10} !important;
      }

      & .MuiInputBase-root:before, .MuiInput-root:before {
        border-bottom: 1px solid var(--goblet-input-border);
      }

      & .MuiInputBase-root.Mui-disabled:before, .MuiInput-root.Mui-disabled:before {
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

export const InputContainer = styled(Box)(({ theme }) => {
  const colors = theme?.palette?.colors
  return `

    &.gb-input-container-side {
      margin-top: ${gutter.margin.px};
      width: 100%;
      display: flex;
      min-height: 40px;
      align-items: center;

      & .MuiInputBase-root:hover:before, .MuiInput-root:hover:before {
        border-bottom: 1px solid ${colors.purple10} !important;
      }

      & .MuiInputBase-root:before, .MuiInput-root:before {
        border-bottom: 1px solid var(--goblet-input-border);
      }

      & .MuiInputBase-root.Mui-disabled:before, .MuiInput-root.Mui-disabled:before {
        border-bottom: 1px solid var(--goblet-input-border);
      }

      & .MuiFormHelperText-root {
        top: 100%;
        position: absolute;
      }

    }
  `
})

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
    
    &.MuiInputBase-adornedStart {
      padding-left: 5px;
    }

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

  & .MuiFormHelperText-root {
    margin-left: ${gutter.margin.qpx};
    margin-right: ${gutter.margin.qpx};
  }

`

export const ToggleContainer = styled(Box)`
  display: flex;
  align-items: start;
  flex-direction: column;
  justify-content: start;
  margin-bottom: ${gutter.margin.hpx};
`

export const ToggleLabel = styled(FormLabel)`
  margin-bottom: ${gutter.margin.qpx};
`

export const ToggleWrap = styled(Box)`
`

export const ToggleBtn = styled(ToggleButton)`
  height: 40px;
  font-size: 12px;
  text-transform: none;
  padding: ${gutter.padding.qpx} ${gutter.padding.hpx};
`
export const ToggleGrp = styled(ToggleButtonGroup)``



// ----- Shared Input Label Component ---- //
export const InputLabelShared = styled(MuiInputLabel)`
  &.gb-label-side {
    padding: 0px;
  }
`

export const WrapInputLabel = styled(Box)`

  &.gb-label-wrap {
    margin-bottom: ${gutter.margin.qpx};
  }
  

  &.gb-label-wrap-side {
    min-width: 80px;
    margin-right: 0px;
  }

`