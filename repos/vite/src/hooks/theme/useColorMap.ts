import { useMemo } from 'react'
import { useTheme } from '@mui/material/styles'


export const useColorMap = () => {
  const theme = useTheme()
  const info = theme.palette.info.main
  const error = theme.palette.error.main
  const warning = theme.palette.warning.main
  const success = theme.palette.success.main
  const primary = theme.palette.primary.main
  const disabled = theme.palette.action.disabled

  return useMemo(() => {
    return {
      info,
      error,
      warning,
      success,
      primary,
      disabled,
    }
  }, [
    info,
    error,
    warning,
    success,
    primary,
    disabled,
  ])
}