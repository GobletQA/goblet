import { styled, Theme, CSSObject } from '@mui/material/styles'
import TextField from '@mui/material/TextField'

export const StyledInput = styled(TextField)(() => {
  return {
    [`input[type=number]`]: {
      MozAppearance: `textfield`,
    },
    [`input::-webkit-outer-spin-button, input::-webkit-inner-spin-button`]: {
      margin: 0,
      WebkitAppearance: `none`,
    },
    [`fieldset`]: {
      borderRadius: 0,
      borderTop: `none`,
      borderLeft: `none`,
      borderRight: `none`,
    }
  }
})