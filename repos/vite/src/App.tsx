import type { TGobletTheme, TThemeTypes } from '@types'
import type { Dispatch, SetStateAction } from 'react'

import '@utils/components/globalOnCopy'
import { useState, useMemo, useEffect, useRef } from 'react'

import { Store } from '@store'
import { Provider } from 'react-redux'
import { initApp } from '@actions/init'
import { AuthActive } from '@constants'
import { createTheme } from '@theme/Theme'
import { RootScreen } from 'src/screens/Root'
import { Fadeout } from '@components/Fadeout'
import { AppStyles } from '@components/AppStyles'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { ModalProvider } from '@contexts/ModalContext'
import { ModalManager } from '@components/ModalManager'
import { useWindowResize } from '@hooks/dom/useWindowResize'

const onAppInit = async (
  setApiTimeout:Dispatch<SetStateAction<string|false>>,
  setStart:Dispatch<SetStateAction<boolean>>
) => {
  let timeout:NodeJS.Timeout

  new Promise((res, rej) => {
    timeout = setTimeout(() => rej(), 3000)
    return initApp()
      .then(() => res(clearTimeout(timeout)))
      .catch((err:any) => {
        clearTimeout(timeout)
        rej(err)
      })
  })
  .then(() => setStart(true))
  .catch((err:any) => setApiTimeout(err?.message || `Backend API Server is not responding`))
}

const useAppInit = () => {
  const appInitRef = useRef<boolean>(false)
  const [start, setStart] = useState(false)
  const [apiTimeout, setApiTimeout] = useState<string|false>(false)

  useEffect(() => {
    if(appInitRef.current) return

    appInitRef.current = true
    onAppInit(setApiTimeout, setStart)
  }, [])

  return {
    start,
    apiTimeout
  }
}

const App = () => {

  useWindowResize()
  const { start, apiTimeout } = useAppInit()

  const [themeType, setThemeType] = useState<TThemeTypes>(`light`)
  const theme = useMemo(() => createTheme(themeType) as TGobletTheme, [themeType])

  return (
    <>
      <AppStyles theme={theme} />
      <Provider store={Store}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <ModalProvider>
            <RootScreen themeSwitch={setThemeType} />
            <ModalManager />
          </ModalProvider>
          {AuthActive && (<Fadeout start={start} content={apiTimeout} />)}
        </ThemeProvider>
      </Provider>
    </>
  )
}

export default App