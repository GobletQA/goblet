import type { TGobletTheme } from '@types'
import { useTheme as useMuiTheme } from '@mui/material/styles'

export const useTheme = () => {
  const theme = useMuiTheme()

  return theme as TGobletTheme
} 
