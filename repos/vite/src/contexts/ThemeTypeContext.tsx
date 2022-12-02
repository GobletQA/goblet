import type { TThemeType, TThemeChildren, TThemeProvider } from '@types'

import { EThemeType } from '@types'
import { noOpObj } from '@keg-hub/jsutils'
import { useEffectOnce } from '@hooks/useEffectOnce'
import { localStorage } from '@services/localStorage'
import { createContext, memo, useContext } from 'react'

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

const ThemeChildren = memo(({children}:TThemeChildren) => (<>{children}</>))

export const ThemeTypeProvider = (props:TThemeProvider) => {
  const { children, ...rest } = props

  useEffectOnce(() => {
    (async () => {
      const type = await localStorage.getThemeType()
      rest.type !== type && rest.setType(type)
    })()
  })

  return (
    <ThemeTypeContext.Provider value={rest as TThemeType}>
      <ThemeChildren children={children} />
    </ThemeTypeContext.Provider>
  )
}

