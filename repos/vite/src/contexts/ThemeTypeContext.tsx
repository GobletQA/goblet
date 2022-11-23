import type { EThemeType } from '@types'
import { noOpObj } from '@keg-hub/jsutils'
import { createContext, memo, useContext } from 'react'

export type TThemeType = {
  type:EThemeType
  setType: (type:EThemeType) => any
}

export type TThemeProvider = TThemeType & {
  children: any
}

export const ThemeTypeContext = createContext<TThemeType>(noOpObj as TThemeType)

export const useThemeType = () => {
  return useContext(ThemeTypeContext)
}

const ThemeTypeChildren = memo((props:Omit<TThemeProvider, `type`|`theme`|`setType`>) => {
  return (<>{props.children}</>)
})

export const ThemeTypeProvider = (props:TThemeProvider) => {
  const { children, ...rest } = props

  return (
    <ThemeTypeContext.Provider value={rest as TThemeType}>
      <ThemeTypeChildren children={children} />
    </ThemeTypeContext.Provider>
  )
}

