import { useMemo } from 'react'
import { useTheme } from '@hooks/theme/useTheme'
import { EThemeType } from '@gobletqa/components'
import { lightTerminal, darkTerminal } from '@theme/terminal'


export const useTerminalTheme = () => {
  const mode = useTheme()?.palette?.mode as EThemeType
  return useMemo(() => {
    return {
      mode,
      theme: darkTerminal,
      // theme: mode === EThemeType.light ? lightTerminal : darkTerminal
    }
  }, [mode])
}