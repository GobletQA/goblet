import type { TThemeTypes } from '@theme/theme.types'

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

const onAppInit = async (setApiTimeout:(...args:any[])=>any) => {
  let timeout:NodeJS.Timeout

  new Promise((res, rej) => {
    timeout = setTimeout(() => rej(), 3000)
    return initApp().then(() => res(clearTimeout(timeout)))
  })
  .catch(() => setApiTimeout(`Backend API Server is not responding`))
}

const App = () => {
  const [themeType, setThemeType] = useState<TThemeTypes>(`light`)
  const theme = useMemo(() => createTheme(themeType), [themeType])
  const appInitRef = useRef<boolean>(false)

  const [apiTimeout, setApiTimeout] = useState(false)
  const [start, setStart] = useState(false)
  useEffect(() => {
    if(appInitRef.current) return

    appInitRef.current = true
    onAppInit(setApiTimeout)
    setStart(true)
  }, [])

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