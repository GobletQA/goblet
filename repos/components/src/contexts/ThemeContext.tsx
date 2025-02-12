import type { ReactNode } from 'react'
import type { EThemeMode, TThemeType, TThemeProvider, TGobletTheme } from '@GBC/types'

import { createContext, useContext, useMemo, useState } from 'react'
import { getTheme } from '@GBC/theme'
import { noOpObj } from '@keg-hub/jsutils'
import { StorageKeys  } from '@GBC/constants'
import CssBaseline from '@mui/material/CssBaseline'
import { AppStyles } from '@GBC/components/AppStyles'
import { localStorage } from '@GBC/services/localStorage'
import { MemoChildren } from '@GBC/components/MemoChildren'
import { useEffectOnce } from '@GBC/hooks/components/useEffectOnce'
import { ThemeType } from '@gobletqa/components/theme/initThemeType'
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles'

export type TTheme = {
  children:ReactNode
  globalStyles?:(props:Record<`theme`, TGobletTheme>) => string
}

export const ThemeTypeContext = createContext<TThemeType>(noOpObj as TThemeType)

export const useThemeType = () => {
  const { type, setType } = useContext(ThemeTypeContext)

  return {
    type,
    setType: async (type:EThemeMode) => {
      await localStorage.set(StorageKeys.THEME_TYPE, type, false)
      setType(type)
    }
  }
}

/**
 * Must be a separate component from the ThemeTypeProvider
 * This ensure the theme type can be set from async local storage
 * and then be used this component
 */
const GobletTheme = (props:TTheme) => {
  const { type } = useThemeType()
  const { globalStyles } = props

  const theme = useMemo(
    () => getTheme(type || ThemeType) as TGobletTheme,
    [type]
  )

  return (
    <>
      <AppStyles
        theme={theme}
        globalStyles={globalStyles}
      />
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        <MemoChildren {...props} />
      </MUIThemeProvider>
    </>
  )
}

const ThemeTypeProvider = (props:TThemeProvider) => {
  const { children, ...rest } = props

  useEffectOnce(() => {
    (async () => {
      rest.type !== ThemeType
        && rest.setType(ThemeType)
    })()
  })

  return (
    <ThemeTypeContext.Provider value={rest as TThemeType}>
      <MemoChildren children={children} />
    </ThemeTypeContext.Provider>
  )
}

export const ThemeProvider = (props:TTheme) => {
  const [themeType, setThemeType] = useState<EThemeMode>(ThemeType as EThemeMode)
  const { globalStyles, ...rest } = props

  return (
    <ThemeTypeProvider type={themeType} setType={setThemeType}>
      <GobletTheme globalStyles={globalStyles} >
        <MemoChildren {...rest} />
      </GobletTheme>
    </ThemeTypeProvider>
  )
}