import type { ReactNode } from 'react'
import type { TThemeType, TThemeProvider, TGobletTheme } from '@types'

import { createContext, useContext, useMemo, useState } from 'react'

import { EThemeType } from '@types'
import { getTheme } from '@theme/theme'
import { noOpObj } from '@keg-hub/jsutils'
import { ThemeType } from '@theme/initThemeType'
import { AppStyles } from '@components/AppStyles'
import CssBaseline from '@mui/material/CssBaseline'
import { useEffectOnce } from '@hooks/useEffectOnce'
import { localStorage } from '@services/localStorage'
import { MemoChildren } from '@components/MemoChildren'
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles'

export type TTheme = {
  children:ReactNode
}

export const ThemeTypeContext = createContext<TThemeType>(noOpObj as TThemeType)


export const useThemeType = () => {
  const { type, setType } = useContext(ThemeTypeContext)
  return {
    type,
    setType: async (type:EThemeType) => {
      await localStorage.setThemeType(type)
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

  const theme = useMemo(
    () => getTheme(type || ThemeType) as TGobletTheme,
    [type]
  )

  return (
    <>
      <AppStyles theme={theme} />
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
      const type = await localStorage.getThemeType()
      rest.type !== type && rest.setType(type)
    })()
  })

  return (
    <ThemeTypeContext.Provider value={rest as TThemeType}>
      <MemoChildren children={children} />
    </ThemeTypeContext.Provider>
  )
}

export const ThemeProvider = (props:TTheme) => {
  const [themeType, setThemeType] = useState<EThemeType>(ThemeType as EThemeType)

  return (
    <ThemeTypeProvider type={themeType} setType={setThemeType}>
      <GobletTheme>
        <MemoChildren {...props} />
      </GobletTheme>
    </ThemeTypeProvider>
  )
}