import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'

export const SettingInput = styled(TextField)(() => {
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

export const SettingContainer = styled(Box)``

export const SettingTags = styled(Autocomplete)``