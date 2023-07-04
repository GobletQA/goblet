
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import MuiSelect from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'

import { gutter } from '@GBC/theme'


// ----- Select Component ---- //

export const SelectContainer = styled(FormControl)(({ theme }) => {
  const colors = theme?.palette?.colors
  return `

    & .MuiInputBase-input {
      
    }

    & label.MuiFormLabel-root {
      display: initial;
      position: relative;
    }

    & .MuiFormHelperText-root {
      margin-left: 0px;
      margin-right: 0px;
    }
    
    & fieldset {
      top: 0px;
      height: 40px;
    }
    
    & fieldset legend {
      display: none
    }
  `
})

export const SelectComp = styled(MuiSelect)(({ theme }) => {
  return `
    height: 40px;
    min-height: 40px;
    padding-top: 0px;
    margin-bottom: 0px;
    padding-bottom: 0px;
    color: var(--goblet-editor-foreground);
    background-color: var(--goblet-editor-raceBackground);

    padding-top: 0px;
    padding-bottom: 0px;
    
    &.MuiInputBase-adornedStart {
      padding-left: 5px;
    }

    & .MuiSelect-select {
      padding-top: 0px !important;
      padding-bottom: 0px !important;
    }

    & input {
      height: 40px;
      padding-top: 0px !important;
      padding-bottom: 0px !important;
    }

    & input::placeholder {
      font-size: 14px;
    }

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
})


export const Option = styled(MenuItem)(({ theme }) => {
  return ``
})

export const HelperText = styled(FormHelperText)(({ theme }) => {
  return ``
})

