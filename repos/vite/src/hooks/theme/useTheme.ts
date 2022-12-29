import type { TGobletTheme } from '@gobletqa/components'
import { useTheme as useMuiTheme } from '@mui/material/styles'

export const useTheme = () => {
  const theme = useMuiTheme()

  return theme as TGobletTheme
} 
